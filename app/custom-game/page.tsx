import CustomGameForm from "./form";

export default function CustomGamePage(props: {
  params: Promise<{ id: string }>;
}) {
  return <CustomGameForm params={props.params} />;
}
