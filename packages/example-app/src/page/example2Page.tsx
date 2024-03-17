import React from 'react';
import { PageLayout } from '../layout/pageLayout';
import styles from "./example2Page.module.scss";
import { ListView, ListViewItem, ListViewRow } from 'ts-react-listview';
export function Example2Page(
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
    <PageLayout title="Example2">
      <div>
        <ListView hasRowHeader={true} rowHeaderWidth={300} rowHeight={100}headers={[
          {
            name: "a",
            label: <div className={styles.listViewCloumn}>A</div>,
            defaultWidth: 70,
          },
          {
            name: "b",
            label: <div className={styles.listViewCloumn}>B</div>,
            defaultWidth: 100,
          },
          {
            name: "c",
            label: <div className={styles.listViewCloumn}>C</div>,
            defaultWidth: 120,
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