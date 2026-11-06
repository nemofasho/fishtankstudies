import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getProfile,
    updateProfile
} from "../services/profileService";

import { useAuth } from "../context/AuthContext";

import "../styles/profile.css";

function Profile() {

    const [profile, setProfile] = useState(null);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { logout } = useAuth();

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {

        try {
            setLoading(true);
            setError("");

            const data = await getProfile();

            setProfile(data);
            setUsername(data.username || "");
            setBio(data.bio || "");

        } catch (err) {

            console.error(
                "Failed to load profile:",
                err
            );

            setError(
                err.message ||
                "Failed to load profile."
            );

        } finally {
            setLoading(false);
        }
    }

    function startEditing() {

        setUsername(profile.username || "");
        setBio(profile.bio || "");

        setSuccess("");
        setError("");
        setEditing(true);
    }

    function cancelEditing() {

        setUsername(profile.username || "");
        setBio(profile.bio || "");

        setError("");
        setSuccess("");
        setEditing(false);
    }

    async function handleSave(event) {

        event.preventDefault();

        if (!username.trim()) {
            setError("Username cannot be empty.");
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const updatedProfile =
                await updateProfile({
                    username: username.trim(),
                    bio: bio.trim()
                });

            setProfile(updatedProfile);
            setUsername(updatedProfile.username || "");
            setBio(updatedProfile.bio || "");

            setEditing(false);
            setSuccess(
                "Profile updated successfully."
            );

        } catch (err) {

            console.error(
                "Failed to update profile:",
                err
            );

            setError(
                err.message ||
                "Failed to update profile."
            );

        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="profile-page-state">
                <h2>Loading Profile...</h2>
                <p>
                    Loading your profile.
                </p>
            </main>
        );
    }

    if (error && !profile) {
        return (
            <main className="profile-page-state">
                <h2>Unable to load Profile</h2>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={loadProfile}
                >
                    Try Again
                </button>
            </main>
        );
    }

    return (
        <main className="profile-page">

            <div className="profile-container">

                {/* PROFILE HEADER */}

                <section className="profile-card profile-header">

                    <div className="profile-avatar">
                        {profile.username
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="profile-header-info">

                        <h1>
                            {profile.username}
                        </h1>

                        <p>
                            {profile.email}
                        </p>

                    </div>

                    {!editing && (
                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={startEditing}
                        >
                            Edit Profile
                        </button>
                    )}

                </section>


                {/* MESSAGES */}

                {error && (
                    <div className="profile-message profile-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="profile-message profile-success">
                        {success}
                    </div>
                )}


                {/* PROFILE INFORMATION */}

                <section className="profile-card">

                    <div className="profile-section-header">
                        <div>
                            <span className="profile-label">
                                Profile
                            </span>

                            <h2>
                                About You
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="profile-logout-button"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>

                    {editing ? (

                        <form
                            className="profile-form"
                            onSubmit={handleSave}
                        >

                            <div className="profile-field">

                                <label htmlFor="profile-username">
                                    Username
                                </label>

                                <input
                                    id="profile-username"
                                    type="text"
                                    value={username}
                                    onChange={event =>
                                        setUsername(
                                            event.target.value
                                        )
                                    }
                                    maxLength={50}
                                    disabled={saving}
                                    required
                                />

                            </div>


                            <div className="profile-field">

                                <label htmlFor="profile-email">
                                    Email
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />

                                <span className="profile-help">
                                    Email cannot be changed here.
                                </span>

                            </div>


                            <div className="profile-field">

                                <label htmlFor="profile-bio">
                                    Bio
                                </label>

                                <textarea
                                    id="profile-bio"
                                    value={bio}
                                    onChange={event =>
                                        setBio(
                                            event.target.value
                                        )
                                    }
                                    maxLength={500}
                                    rows={5}
                                    placeholder="Tell your study group a little about yourself..."
                                    disabled={saving}
                                />

                                <span className="profile-character-count">
                                    {bio.length}/500
                                </span>

                            </div>


                            <div className="profile-form-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={cancelEditing}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    ) : (

                        <div className="profile-information">

                            <div className="profile-info-row">
                                <span>
                                    Username
                                </span>

                                <strong>
                                    {profile.username}
                                </strong>
                            </div>

                            <div className="profile-info-row">
                                <span>
                                    Email
                                </span>

                                <strong>
                                    {profile.email}
                                </strong>
                            </div>

                            <div className="profile-info-row profile-bio-row">
                                <span>
                                    Bio
                                </span>

                                <p>
                                    {profile.bio ||
                                        "No bio yet."}
                                </p>
                            </div>

                            <div className="profile-info-row">
                                <span>
                                    Member Since
                                </span>

                                <strong>
                                    {profile.createdAt
                                        ? new Date(
                                            profile.createdAt
                                        ).toLocaleDateString(
                                            undefined,
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            }
                                        )
                                        : "—"}
                                </strong>
                            </div>

                        </div>

                    )}

                </section>


                {/* MY TANKS */}

                <section className="profile-card">

                    <div className="profile-section-header">

                        <div>
                            <span className="profile-label">
                                Study Groups
                            </span>

                            <h2>
                                My Tanks
                            </h2>
                        </div>

                        <span className="profile-count">
                            {profile.tanks?.length || 0}
                        </span>

                    </div>


                    {!profile.tanks ||
                    profile.tanks.length === 0 ? (

                        <div className="profile-empty">

                            <p>
                                You aren't a member of any
                                tanks yet.
                            </p>

                            <Link
                                to="/tanks/find"
                                className="profile-link-button"
                            >
                                Find a Tank
                            </Link>

                        </div>

                    ) : (

                        <div className="profile-tanks">

                            {profile.tanks.map(tank => (

                                <Link
                                    key={tank.id}
                                    to={`/tanks/${tank.id}`}
                                    className="profile-tank-card"
                                >

                                    <div>
                                        <h3>
                                            {tank.name}
                                        </h3>

                                        <p>
                                            {tank.className ||
                                                tank.subject ||
                                                "Study Group"}
                                        </p>
                                    </div>

                                    <span>
                                        →
                                    </span>

                                </Link>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

export default Profile;