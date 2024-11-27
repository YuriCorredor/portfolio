export default function SkillsItem({ name, Icon, color, nameColor }) {
    return (
        <div className="group relative">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/70 transition-all duration-300 border border-white/5 shadow-2xl">
                <Icon color={color} size={20} />
                <span className={`text-sm text-gray-300 capitalize${nameColor ? ` ${nameColor}` : ''}`}>{name}</span>
            </div>
        </div>
    )
}
