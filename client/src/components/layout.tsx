import { PropsWithChildren } from "react";
import { PageHeader } from "./pageHeader";
import { PageFooter } from "./pageFooter";

export function Layout(props: PropsWithChildren) {
  return (
    <>
      <PageHeader />
      {props.children}
      <PageFooter />
    </>
  );
}
