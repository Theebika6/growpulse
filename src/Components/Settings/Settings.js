import React, { useState, useEffect } from 'react';
import './Settings.css';
import { auth } from '../../firebaseConfig';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const Settings = ({ sidebarExpanded }) => {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentName, setCurrentName] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [error, setError] = useState('');
    const [accountCreationDate, setAccountCreationDate] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const db = getDatabase();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUserId(currentUser.uid); // Set user ID

            const nameRef = ref(db, 'Registered Users/' + currentUser.uid + '/fullName');
            onValue(nameRef, (snapshot) => {
                const name = snapshot.val() || 'No name set';
                setCurrentName(name);
            });

            setCurrentEmail(currentUser.email);

            if (currentUser.metadata.creationTime) {
                setAccountCreationDate(currentUser.metadata.creationTime);
            }
        }
    }, []);

    const handleNameChange = (e) => setNewName(e.target.value);
    const handleEmailChange = (e) => setNewEmail(e.target.value);
    const handlePasswordChange = (e) => setNewPassword(e.target.value);

    const updateUserProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            const db = getDatabase();

            if (newName && currentUser) {
                await updateProfile(currentUser, { displayName: newName });
                // Update in Realtime Database
                const userRef = ref(db, 'Registered Users/' + currentUser.uid + '/fullName');
                await set(userRef, newName);
                setCurrentName(newName);
            }
            if (newEmail && currentUser) {
                await updateEmail(currentUser, newEmail);
                setCurrentEmail(newEmail);
            }
            if (newPassword && currentUser) {
                await updatePassword(currentUser, newPassword);
            }

            alert('Profile updated successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className="settings">
                <div className="account-settings">
                    <div className="account-detail">
                        <h4>Account Username:</h4>
                        <div className="current-value">
                            <span>{currentName}</span>
                        </div>
                    </div>
                    <div className='user-input-settings username-input'>
                        <input type="text" placeholder="New Name" value={newName} onChange={handleNameChange} />
                    </div>
                </div>
                <div className="account-settings email-settings">
                    <div className="account-detail">
                        <h4>Account Email:</h4>
                        <div className="current-value">
                            <span>{currentEmail}</span>
                        </div>
                    </div>
                    <div className='user-input-settings'>
                        <input type="email" placeholder="New Email" value={newEmail} onChange={handleEmailChange} />
                        <input type="email" placeholder="Confirm Email" value={newPassword} onChange={handleEmailChange} />
                    </div>
                </div>
                <div className="account-settings">
                    <div className="account-detail">
                        <h4>Account Password:</h4>
                        <div className="current-value">
                            <span>*************</span>
                        </div>
                    </div>
                    <div className='user-input-settings'>
                        <input type="password" placeholder="New Password" value={newPassword} onChange={handlePasswordChange} />
                        <input type="password" placeholder="Confirm Password" value={newPassword} onChange={handlePasswordChange} />
                    </div>
                </div>
                <div className="account-settings">
                    <div className="account-detail">
                        <h4 className="account-info-id">User ID:</h4>
                        <div className="current-value">
                            <span className="account-info uid">{userId}</span>
                        </div>
                    </div>
                </div>
                <div className="account-settings">
                    <div className="account-detail">
                        <h4 className="account-info-id">Account Creation Date:</h4>
                        <div className="current-value">
                            <span className="account-info">{accountCreationDate}</span>
                        </div>
                    </div>
                </div>
                <button className={"update-button"} onClick={updateUserProfile}>Update Profile</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Settings;
