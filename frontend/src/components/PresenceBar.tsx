import type { UserPresence } from "../types";

type Props = {
    users: UserPresence[]
};

function PresenceBar({ users }: Props) {

    return (
        <div className="flex items-center gap-2">
            {users.map(user => (
                <img
                    key={user.userId}
                    src={user.userAvatar}
                    alt={user.userName}
                    title={user.userName}
                    className="w-8 h-8 rounded-full border-2 border-gray-500"
                />
            ))}
        </div>
    )
}

export default PresenceBar;