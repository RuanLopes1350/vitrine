interface BotaoProps {
    texto: string;
    backgroundColor?: string;
    color?: string;
    onClick?: () => void;
}

export default function Botao({ texto, backgroundColor, color, onClick }: BotaoProps) {
    return (
        <>
        <button style={{ backgroundColor, color }} onClick={onClick}>
            {texto}
        </button>
        </>
    )
}