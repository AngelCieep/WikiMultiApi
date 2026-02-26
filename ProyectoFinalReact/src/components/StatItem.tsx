type ItemProps = {
    value: string | number;
    label: string;
}
export default function StatItem({ value, label }:ItemProps) {
    return (
        <div className="stat-item d-flex flex-column align-items-center border rounded p-4">
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    );
}