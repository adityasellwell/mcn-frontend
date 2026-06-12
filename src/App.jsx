import Container from "./components/ui/Container";
import Button from "./components/ui/Button";
import SectionTitle from "./components/ui/SectionTitle";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Container className="py-20">
        <SectionTitle
          title="Meet. Connect. Grow."
          subtitle="MCN helps professionals build meaningful business relationships."
        />

        <div className="flex gap-4">
          <Button>Join MCN</Button>

          <Button variant="secondary">
            Learn More
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default App;