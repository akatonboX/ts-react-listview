import React from "react";
export declare const ListView: (props: {
    headers: {
        name: string;
        label: React.ReactNode;
        defaultWidth: number;
    }[];
    children: React.ReactElement<ListViewRowProps, typeof ListViewRow>[] | React.ReactElement<ListViewRowProps, typeof ListViewRow>;
}) => React.JSX.Element;
type ListViewRowProps = {
    children: React.ReactElement<ListViewItemProps, typeof ListViewItem>[] | React.ReactElement<ListViewItemProps, typeof ListViewItem>;
};
export declare const ListViewRow: (props: ListViewRowProps) => React.JSX.Element;
type ListViewItemProps = {
    name: string;
    children: React.ReactNode;
};
export declare const ListViewItem: (props: ListViewItemProps) => React.JSX.Element;
export {};
