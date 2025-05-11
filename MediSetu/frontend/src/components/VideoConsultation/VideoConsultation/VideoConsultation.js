'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './VideoConsultation.module.css';
import VideoCall from '@/utils/VideoCall';
import { generateConsultationSummary } from '@/utils/groqService';

const VideoConsultation = () => {
    const [currentRole, setCurrentRole] = useState(null);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [roomId, setRoomId] = useState('Not connected');
    const [consultationText, setConsultationText] = useState('');
    const [isPrescriptionApproved, setIsPrescriptionApproved] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [generationError, setGenerationError] = useState(null);
    const videoCallRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        // Initialize VideoCall class
        videoCallRef.current = new VideoCall({
            onLocalStream: (stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            },
            onRemoteStream: (stream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
            },
            onMessage: (text, role, messageId) => {
                addMessageToChat(text, role, messageId);
            },
            onConnectionStatus: (isConnected) => {
                updateConnectionStatus(isConnected);
            },
            onError: (message) => {
                showError(message);
            }
        });

        // Cleanup on unmount
        return () => {
            if (videoCallRef.current) {
                videoCallRef.current.endCall();
            }
        };
    }, []);

    const setRole = (role) => {
        setCurrentRole(role);
        setConversationHistory([]);
    };

    const startCall = async () => {
        const newRoomId = 'room-' + Math.random().toString(36).substr(2, 9);
        const userId = 'user-' + Math.random().toString(36).substr(2, 9);
        
        try {
            const success = await videoCallRef.current.initializeCall(newRoomId, userId, currentRole);
            if (success) {
                videoCallRef.current.startLocalVideo();
                setRoomId(newRoomId);
            }
        } catch (error) {
            console.error('Call initialization failed:', error);
            showError('Failed to start call: ' + error.message);
        }
    };

    const joinCall = async () => {
        const roomId = document.getElementById('roomIdInput').value.trim();
        if (!roomId) {
            alert('Please enter a Room ID');
            return;
        }

        const userId = 'user-' + Math.random().toString(36).substr(2, 9);
        const success = await videoCallRef.current.initializeCall(roomId, userId, currentRole);
        
        if (success) {
            videoCallRef.current.startLocalVideo();
        }
    };

    const toggleMic = () => {
        const isMuted = videoCallRef.current.toggleAudio();
        const micButton = document.getElementById('toggleMic');
        if (micButton) {
            micButton.classList.toggle('muted', isMuted);
            micButton.innerHTML = isMuted ? 
                '<i className="fas fa-microphone-slash"></i>' : 
                '<i className="fas fa-microphone"></i>';
        }
    };

    const toggleVideo = () => {
        const isVideoOff = videoCallRef.current.toggleVideo();
        const videoButton = document.getElementById('toggleVideo');
        if (videoButton) {
            videoButton.classList.toggle('muted', isVideoOff);
            videoButton.innerHTML = isVideoOff ? 
                '<i className="fas fa-video-slash"></i>' : 
                '<i className="fas fa-video"></i>';
        }
    };

    const endCall = () => {
        if (currentRole === 'doctor') {
            generatePrescription();
        }
        videoCallRef.current.endCall();
        resetUI();
    };

    const resetUI = () => {
        setCurrentRole(null);
        setConversationHistory([]);
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    const generatePrescription = async () => {
        try {
            setIsGeneratingSummary(true);
            setGenerationError(null);
            
            const summary = await generateConsultationSummary(conversationHistory);
            setConsultationText(summary);
        } catch (error) {
            console.error('Error generating summary:', error);
            setGenerationError('Failed to generate summary. Please try again or write it manually.');
            
            // Fallback to manual generation
            const manualSummary = `Based on our consultation, here are the key points and recommendations:

1. Symptoms Discussed:
${conversationHistory.filter(msg => msg.role === 'patient').map(msg => `- ${msg.text}`).join('\n')}

2. Doctor's Observations:
${conversationHistory.filter(msg => msg.role === 'doctor').map(msg => `- ${msg.text}`).join('\n')}

3. Recommended Actions:
- Please follow the prescribed medication schedule
- Schedule a follow-up appointment if symptoms persist
- Contact emergency services if you experience severe symptoms

4. Additional Notes:
- Keep track of any changes in symptoms
- Maintain a healthy lifestyle
- Follow up with your primary care physician`;

            setConsultationText(manualSummary);
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleConsultationTextChange = (e) => {
        setConsultationText(e.target.value);
    };

    const approvePrescription = () => {
        setIsPrescriptionApproved(true);
        // Notify patient that prescription is ready
        if (videoCallRef.current) {
            videoCallRef.current.socket.emit('prescription-approved', {
                roomId: roomId,
                prescription: consultationText
            });
        }
    };

    const downloadPrescription = () => {
        const element = document.createElement('a');
        const file = new Blob([consultationText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `prescription-${roomId}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const addMessageToChat = (text, role, messageId) => {
        if (!chatMessagesRef.current) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role === 'doctor' ? 'doctor' : 'patient'}`;
        if (messageId) {
            messageDiv.id = messageId;
        }
        
        const roleLabel = document.createElement('span');
        roleLabel.className = 'role-label';
        roleLabel.textContent = role === 'doctor' ? 'Doctor:' : 'Patient:';
        
        const messageText = document.createElement('span');
        messageText.textContent = text;
        
        messageDiv.appendChild(roleLabel);
        messageDiv.appendChild(messageText);
        chatMessagesRef.current.appendChild(messageDiv);
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;

        setConversationHistory(prev => [...prev, {
            role,
            text,
            timestamp: Date.now(),
            messageId
        }]);
    };

    const updateConnectionStatus = (isConnected) => {
        const status = document.getElementById('transcriptionStatus');
        if (!status) return;

        if (isConnected) {
            status.innerHTML = '<i className="fas fa-check-circle"></i> Connected';
            status.classList.remove('error');
        } else {
            status.innerHTML = '<i className="fas fa-exclamation-circle"></i> Disconnected';
            status.classList.add('error');
        }
    };

    const showError = (message) => {
        console.error(message);
        const status = document.getElementById('transcriptionStatus');
        if (status) {
            status.innerHTML = `<i className="fas fa-exclamation-circle"></i> ${message}`;
            status.classList.add('error');
        }
    };

    return (
        <div className={styles.container}>
            {!currentRole && (
                <div className={styles.roleSelector}>
                    <h2>Select Your Role</h2>
                    <div className={styles.roleButtons}>
                        <button className={styles.roleButton} onClick={() => setRole('doctor')}>
                            <i className="fas fa-user-md"></i> I am a Doctor
                        </button>
                        <button className={styles.roleButton} onClick={() => setRole('patient')}>
                            <i className="fas fa-user"></i> I am a Patient
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.mainContainer}>
                <div className={styles.videoSection}>
                    {currentRole === 'doctor' && (
                        <div className={styles.doctorControls}>
                            <div className={styles.roomInfo}>
                                <h3>Room ID: <span className={styles.roomId}>{roomId}</span></h3>
                                <p>Share this Room ID with your patient to start the video call</p>
                            </div>
                            <div className={styles.controls}>
                                <button className={styles.roleButton} onClick={startCall}>
                                    <i className="fas fa-phone"></i> Start Call
                                </button>
                            </div>
                        </div>
                    )}

                    {currentRole === 'patient' && (
                        <div className={styles.patientControls}>
                            <div className={styles.joinForm}>
                                <h3>Join Doctor's Call</h3>
                                <input type="text" id="roomIdInput" placeholder="Enter Room ID provided by your doctor" />
                                <button className={styles.roleButton} onClick={joinCall}>
                                    <i className="fas fa-sign-in-alt"></i> Join Call
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.videoContainer}>
                        <div className={styles.videoBox}>
                            <video ref={localVideoRef} autoPlay muted playsInline />
                            <div className={styles.videoLabel}>You</div>
                        </div>
                        <div className={styles.videoBox}>
                            <video ref={remoteVideoRef} autoPlay playsInline />
                            <div className={styles.videoLabel}>{currentRole === 'doctor' ? 'Patient' : 'Doctor'}</div>
                        </div>
                    </div>

                    <div className={styles.mediaControls}>
                        <button id="toggleMic" className={styles.mediaButton} onClick={toggleMic}>
                            <i className="fas fa-microphone"></i>
                        </button>
                        <button id="toggleVideo" className={styles.mediaButton} onClick={toggleVideo}>
                            <i className="fas fa-video"></i>
                        </button>
                        <button className={`${styles.mediaButton} ${styles.endCallButton}`} onClick={endCall}>
                            <i className="fas fa-phone-slash"></i>
                        </button>
                    </div>

                    {currentRole === 'doctor' && (
                        <div className={styles.prescriptionSection}>
                            <h3>Consultation Summary</h3>
                            {generationError && (
                                <div className={styles.errorMessage}>
                                    <i className="fas fa-exclamation-circle"></i>
                                    {generationError}
                                </div>
                            )}
                            <div className={styles.prescriptionActions}>
                                <button 
                                    className={styles.roleButton}
                                    onClick={generatePrescription}
                                    disabled={isGeneratingSummary}
                                >
                                    <i className="fas fa-magic"></i> 
                                    {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
                                </button>
                            </div>
                            <textarea
                                className={styles.prescriptionContent}
                                value={consultationText}
                                onChange={handleConsultationTextChange}
                                placeholder="Edit consultation summary here..."
                            />
                            <div className={styles.prescriptionActions}>
                                <button 
                                    className={styles.roleButton}
                                    onClick={approvePrescription}
                                    disabled={isPrescriptionApproved || isGeneratingSummary}
                                >
                                    <i className="fas fa-check"></i> Approve Prescription
                                </button>
                            </div>
                        </div>
                    )}

                    {currentRole === 'patient' && isPrescriptionApproved && (
                        <div className={styles.prescriptionSection}>
                            <h3>Your Prescription</h3>
                            <div className={styles.prescriptionContent}>
                                {consultationText}
                            </div>
                            <div className={styles.prescriptionActions}>
                                <button 
                                    className={styles.roleButton}
                                    onClick={downloadPrescription}
                                >
                                    <i className="fas fa-download"></i> Download Prescription
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.chatSection}>
                    <div className={styles.chatHeader}>
                        <i className="fas fa-comments"></i> Live Transcription
                    </div>
                    <div className={styles.chatMessages} ref={chatMessagesRef}></div>
                    <div className={styles.transcriptionStatus} id="transcriptionStatus">
                        <i className="fas fa-clock"></i> Waiting for other user to connect...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoConsultation; 