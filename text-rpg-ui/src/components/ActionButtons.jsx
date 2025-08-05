export default function ActionButtons({ onAttack, onHeal}) {
    return (
        <div>
            <button onClick={onAttack}>Attack</button>
            <button onClick={onHeal}>Heal</button>
        </div>
    );
}