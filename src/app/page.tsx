import { Button } from "@/components/ui/button";
import { CaretRight } from "@/components/ui/icons";

export default async function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center gap-4">
      <Button variant={"default"}>Button</Button>
      <Button variant={"secondary"}>Button</Button>
      <Button variant={"tertiary"}>Button</Button>
      <Button variant={"destroy"}>Button</Button>
      <CaretRight />
    </div>
  );
}
