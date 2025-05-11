import { io } from 'socket.io-client';

class VideoCall {
    constructor(callbacks = {}) {
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.roomId = null;
        this.userId = null;
        this.role = null;
        this.isAudioEnabled = true;
        this.isVideoEnabled = true;
        this.conversationHistory = [];
        this.recognition = null;
        this.isTranscribing = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.messageQueue = new Map();
        this.messageRetryTimeout = 3000;
        this.maxRetries = 3;
        this.callbacks = callbacks;

        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                {
                    urls: 'turn:openrelay.metered.ca:80',
                    username: 'openrelayproject',
                    credential: 'openrelayproject'
                },
                {
                    urls: 'turn:openrelay.metered.ca:443',
                    username: 'openrelayproject',
                    credential: 'openrelayproject'
                },
                {
                    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                    username: 'openrelayproject',
                    credential: 'openrelayproject'
                }
            ],
            iceCandidatePoolSize: 10,
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require'
        };

        this.socket = io("https://webrtc3-2.onrender.com");
        this.initializeSocketListeners();
    }

    initializeSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
            this.updateConnectionStatus(true);
            this.reconnectAttempts = 0;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.showError('Connection error: ' + error.message);
            this.tryReconnect();
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from signaling server:', reason);
            this.updateConnectionStatus(false);
            if (reason === 'io server disconnect') {
                this.socket.connect();
            } else {
                this.tryReconnect();
            }
        });

        this.socket.on('user-joined', (role) => {
            console.log(`${role} joined the room`);
            if (this.role === 'doctor') {
                this.createOffer();
            }
            this.startTranscription();
        });

        this.socket.on('offer', async (data) => {
            try {
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);
                this.socket.emit('answer', {
                    roomId: this.roomId,
                    answer: answer
                });
            } catch (error) {
                console.error('Error handling offer:', error);
                this.showError('Failed to handle offer');
            }
        });

        this.socket.on('answer', async (data) => {
            try {
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
                console.error('Error handling answer:', error);
                this.showError('Failed to handle answer');
            }
        });

        this.socket.on('ice-candidate', async (data) => {
            try {
                if (this.peerConnection && data.candidate) {
                    await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        this.socket.on('user-left', () => {
            console.log('Other user left the call');
            this.endCall();
        });

        this.socket.on('error', (error) => {
            this.showError(error.message || 'Signaling error occurred');
        });

        this.socket.on('transcription', (data) => {
            if (data.role !== this.role) {
                this.addMessageToChat(data.text, data.role, data.messageId);
                this.socket.emit('transcription-ack', {
                    roomId: this.roomId,
                    messageId: data.messageId
                });
            }
        });

        this.socket.on('transcription-ack', (data) => {
            if (this.messageQueue.has(data.messageId)) {
                this.messageQueue.delete(data.messageId);
            }
        });

        this.socket.on('message-queue', (data) => {
            if (data.role !== this.role) {
                this.addMessageToChat(data.text, data.role);
            }
        });

        this.socket.on('reconnect', () => {
            console.log('Reconnected to server');
            this.updateConnectionStatus(true);
            
            if (this.roomId) {
                this.socket.emit('request-missed-messages', {
                    roomId: this.roomId,
                    lastMessageId: this.conversationHistory.length > 0 
                        ? this.conversationHistory[this.conversationHistory.length - 1].id 
                        : null
                });
            }
        });
    }

    async initializeCall(roomId, userId, role) {
        try {
            this.roomId = roomId;
            this.userId = userId;
            this.role = role;

            await this.initializeWebRTC();

            this.socket.emit('join', {
                roomId: this.roomId,
                userId: this.userId,
                role: this.role
            });

            return true;
        } catch (error) {
            console.error('Call initialization failed:', error);
            this.showError('Failed to initialize call');
            return false;
        }
    }

    async initializeWebRTC() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            this.peerConnection = new RTCPeerConnection(this.configuration);

            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            this.peerConnection.ontrack = (event) => {
                this.remoteStream = event.streams[0];
                if (this.callbacks.onRemoteStream) {
                    this.callbacks.onRemoteStream(this.remoteStream);
                }
            };

            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit('ice-candidate', {
                        roomId: this.roomId,
                        candidate: event.candidate
                    });
                }
            };

            this.peerConnection.onconnectionstatechange = () => {
                console.log('Connection state:', this.peerConnection.connectionState);
                switch(this.peerConnection.connectionState) {
                    case 'connected':
                        this.updateConnectionStatus(true);
                        break;
                    case 'disconnected':
                    case 'failed':
                        this.updateConnectionStatus(false);
                        this.endCall();
                        break;
                }
            };

            this.peerConnection.oniceconnectionstatechange = () => {
                if (this.peerConnection.iceConnectionState === 'failed') {
                    this.restartIce();
                }
            };

        } catch (error) {
            console.error('WebRTC initialization failed:', error);
            throw error;
        }
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            this.socket.emit('offer', {
                roomId: this.roomId,
                offer: offer
            });
        } catch (error) {
            console.error('Error creating offer:', error);
            this.showError('Failed to create offer');
        }
    }

    startLocalVideo() {
        if (this.callbacks.onLocalStream) {
            this.callbacks.onLocalStream(this.localStream);
        }
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                this.isAudioEnabled = audioTrack.enabled;
                return !this.isAudioEnabled;
            }
        }
        return false;
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                this.isVideoEnabled = videoTrack.enabled;
                return !this.isVideoEnabled;
            }
        }
        return false;
    }

    startTranscription() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.showError('Speech recognition not supported in this browser');
            return;
        }

        try {
            if (this.recognition) {
                this.recognition.stop();
                this.recognition = null;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.isTranscribing = true;

            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.updateConnectionStatus(true);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isTranscribing = false;
                
                if (event.error === 'no-speech') {
                    setTimeout(() => {
                        if (this.isTranscribing) {
                            this.recognition.start();
                        }
                    }, 1000);
                } else if (event.error === 'network') {
                    this.showError('Network error in speech recognition');
                } else {
                    this.showError('Speech recognition error: ' + event.error);
                }
            };

            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                if (this.isTranscribing) {
                    setTimeout(() => {
                        if (this.isTranscribing) {
                            this.recognition.start();
                        }
                    }, 1000);
                }
            };

            this.recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        const transcript = event.results[i][0].transcript;
                        this.addTranscriptMessage(transcript);
                    }
                }
            };

            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showError('Failed to start speech recognition');
            this.isTranscribing = false;
        }
    }

    addTranscriptMessage(text) {
        const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        this.socket.emit('transcription', {
            roomId: this.roomId,
            text: text,
            role: this.role,
            messageId: messageId,
            timestamp: Date.now()
        });

        this.addMessageToChat(text, this.role, messageId);

        this.messageQueue.set(messageId, {
            text: text,
            role: this.role,
            retries: 0,
            timestamp: Date.now()
        });

        this.startMessageRetry(messageId);
    }

    startMessageRetry(messageId) {
        const message = this.messageQueue.get(messageId);
        if (!message) return;

        if (message.retries < this.maxRetries) {
            setTimeout(() => {
                if (this.messageQueue.has(messageId)) {
                    message.retries++;
                    console.log(`Retrying message ${messageId}, attempt ${message.retries}`);
                    this.socket.emit('transcription', {
                        roomId: this.roomId,
                        text: message.text,
                        role: message.role,
                        messageId: messageId,
                        timestamp: message.timestamp,
                        isRetry: true
                    });
                    this.startMessageRetry(messageId);
                }
            }, this.messageRetryTimeout);
        } else {
            console.warn(`Message ${messageId} failed after ${this.maxRetries} retries`);
            this.messageQueue.delete(messageId);
        }
    }

    addMessageToChat(text, role, messageId) {
        if (this.callbacks.onMessage) {
            this.callbacks.onMessage(text, role, messageId);
        }

        this.conversationHistory.push({
            role: role,
            text: text,
            timestamp: Date.now(),
            messageId: messageId
        });
    }

    endCall() {
        this.messageQueue.clear();

        if (this.recognition) {
            this.isTranscribing = false;
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
            this.recognition = null;
        }

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        if (this.roomId) {
            this.socket.emit('leave', { roomId: this.roomId });
        }

        this.localStream = null;
        this.remoteStream = null;
        this.roomId = null;
        this.userId = null;
        this.role = null;
    }

    updateConnectionStatus(isConnected) {
        if (this.callbacks.onConnectionStatus) {
            this.callbacks.onConnectionStatus(isConnected);
        }
    }

    showError(message) {
        console.error(message);
        if (this.callbacks.onError) {
            this.callbacks.onError(message);
        }
    }

    async restartIce() {
        try {
            const offer = await this.peerConnection.createOffer({ iceRestart: true });
            await this.peerConnection.setLocalDescription(offer);
            this.socket.emit('offer', {
                roomId: this.roomId,
                offer: offer
            });
        } catch (error) {
            console.error('ICE restart failed:', error);
        }
    }

    tryReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.socket.connect();
            }, 1000 * this.reconnectAttempts);
        } else {
            this.showError('Connection lost. Please refresh the page.');
        }
    }
}

export default VideoCall; 