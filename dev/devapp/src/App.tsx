import styled from "styled-components";
import { useReorder } from "./use-reorder/use-reorder";
import { Item } from "./use-reorder";

const Layout = styled.div`
  display: flex;
`;

const Card = styled.div`
  padding: 0.4rem;
  background: lightgray;
  margin: 0.2rem;
`
const elements: Item[] = [0, 1, 2, 3].map((id) => ({
  id: `${id}`, elem: (
    <Card><p>Item {id}</p></Card>
  )
}));

export default function App() {
  const { reorderer, order } = useReorder(elements);
  return (
    <Layout>
      {reorderer}
      <p>{order}</p>
    </Layout>
  );
}
