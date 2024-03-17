import React from 'react';
import { useRouteError } from 'react-router-dom';
import { PageLayout } from '../layout/pageLayout';
import styles from "./example3Page.module.scss";
import { ListView, ListViewItem, ListViewRow } from '@akatonbo/ts-react-listview';
export function Example3Page(
  props: {
  }
) 
{
  const data : {a: string, b: string, c: string}[] = new Array(100).fill(1).map((item, index) => {
    return {
      a: `A${index}`,
      b: `B${index}`,
      c: `C${index}`,
    };
  });
  return (
    <PageLayout title="Example3">
      <div>
        <ListView horizontalLineStyle="1px solid black" verticvalLineStyle="1px solid black" onResizeColumn={(name, width) => {
          localStorage.setItem(`Example3Page_${name}`, String(width));
        }} headers={[
          {
            name: "a",
            label: <div className={styles.listViewCloumn}>A</div>,
            defaultWidth: Number(localStorage.getItem(`Example3Page_a`) ?? 100),
          },
          {
            name: "b",
            label: <div className={styles.listViewCloumn}>B</div>,
            defaultWidth: Number(localStorage.getItem(`Example3Page_b`) ?? 100),
          },
          {
            name: "c",
            label: <div className={styles.listViewCloumn}>C</div>,
            defaultWidth: Number(localStorage.getItem(`Example3Page_c`) ?? 100),
          },
        ]}>
          {(data ?? []).map((item, index) => (
            <ListViewRow key={index}  header={<div style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>{index}</div>} >
              <ListViewItem name="a">
                <div className={styles.listViewCell}>{item.a}</div>
              </ListViewItem>
              <ListViewItem name="b">
                <div className={styles.listViewCell}>{item.b}</div>
              </ListViewItem>
              <ListViewItem name="c">
                <div className={styles.listViewCell}>{item.c}</div>
              </ListViewItem>
            </ListViewRow>
          ))}
        </ListView>
      </div>
    </PageLayout>
  );
}