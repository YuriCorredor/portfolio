export default function SkillsItem({ name, Icon, color, nameColor }) {
    return (
        <div className="group relative">
            <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50">
                <Icon color={color} size={20} />
                <span className={`text-sm text-gray-300 capitalize${nameColor ? ` ${nameColor}` : ''}`}>{name}</span>
            </div>
        </div>
    )
}
