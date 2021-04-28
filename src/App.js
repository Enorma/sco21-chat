import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function App() {

    return (
        <Container className="mt-5 mb-5 pt-5 pb-5">
            <Form>
                <Form.Group>
                    <Form.Label>Mensaje:</Form.Label>
                    <Form.Control />
                    <Button variant="success">ENVIAR</Button>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Chat:</Form.Label>
                    <Form.Control as="textarea" />
                </Form.Group>
            </Form>
        </Container>
    );
}

export default App;

//eof
