export default function ErrorTemplate({ mensaje, codigo }) {
    return (
        <div
            style={{
                fontFamily:
                    'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                height: "100vh",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                background: "#fff",
                margin: 0,
            }}
        >
            <div>
                <h1
                    style={{
                        display: "inline-block",
                        margin: "0 20px 0 0",
                        padding: "0 23px 0 0",
                        fontSize: "24px",
                        fontWeight: 500,
                        verticalAlign: "top",
                        lineHeight: "49px",
                        borderRight: "1px solid rgba(0, 0, 0, 0.3)",
                    }}
                >
                    {codigo}
                </h1>
                <div style={{ display: "inline-block" }}>
                    <h2
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "49px",
                            margin: 0,
                        }}
                    >
                        {mensaje}
                    </h2>
                </div>
            </div>
        </div>
    );
}
