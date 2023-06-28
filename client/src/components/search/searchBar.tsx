import styles from "@/styles/components/searchBar.module.scss";
import { ChangeEvent } from "react";

interface ISearchBarProps {
  defaultValue?: string;
  placeHolder?: string;
  onChangeFn: (e: ChangeEvent<HTMLInputElement>) => any;
}

export function SearchBar(props: ISearchBarProps) {
  return (
    <input
      type="search"
      id="search"
      name="Search"
      defaultValue={props.defaultValue ?? ""}
      placeholder={props.placeHolder ?? "Search"}
      className={styles.searchBar}
      onChange={props.onChangeFn}
    />
  );
}
