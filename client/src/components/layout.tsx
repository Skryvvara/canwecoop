import { PropsWithChildren } from "react";
import { PageHeader } from "./pageHeader";
import { PageFooter } from "./pageFooter";

export function Layout(props: PropsWithChildren) {
  return (
    <>
      <PageHeader />
      <main id="main">{props.children}</main>
      <PageFooter />
    </>
  );
}
