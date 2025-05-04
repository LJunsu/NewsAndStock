"use client";

export const LogoutButton = () => {
    const handleLogout = async () => {
        await fetch("/api/user/logout", {
            method: "POST",
        });

        window.location.href = "/";
    }

    return (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-full cursor-pointer transform duration-200 hover:bg-red-600">
            로그아웃
        </button>
    );
}