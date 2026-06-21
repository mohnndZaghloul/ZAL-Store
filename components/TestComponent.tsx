"use client";

import { Button } from "./ui/button";

const TestComponent = ({ fun }: { fun: any }) => {
  return <Button onClick={async () => await fun()}>add fake user</Button>;
  //   return <>ss</>;
};

export default TestComponent;
