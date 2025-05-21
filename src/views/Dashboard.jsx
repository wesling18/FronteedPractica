import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
    return(
        <container>
            <br />
            <Card style={{height: 600}}
            >
                <iframe
                title="estadisticas"
                width="100%"
                height="100%"
                src="https://app.powerbi.com/view?r=eyJrIjoiMWNhYWMyMTEtYjc5Ny00ZWQ0LTk3MDAtNzRiYzAxYzA0OTc5IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
                allowFullScreen= "true"
                >
                </iframe>
            </Card>
        </container>
    );
};

export default Dashboard;