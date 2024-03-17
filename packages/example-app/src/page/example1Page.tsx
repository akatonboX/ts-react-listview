import React from 'react';
import { useRouteError } from 'react-router-dom';
import { PageLayout } from '../layout/pageLayout';
import styles from "./example1Page.module.scss";
import { ListView, ListViewItem, ListViewRow } from '@akatonbo/ts-react-listview';
export function Example1Page(
  props: {
  }
) 
{
  const data : {a: string, b: string, c: string, d: string, e: string}[] = new Array(100).fill(1).map((item, index) => {
    return {
      a: `A${index}`,
      b: `B${index}`,
      c: `C${index}`,
      d: `D${index}`,
      e: `E${index}`,
    };
  });
  return (
    <PageLayout title="Example1">
      <div>
        <ListView hasRowHeader={true} rowHeaderWidth={300} rowHeight={100} horizontalLineStyle="1px solid black" verticvalLineStyle="1px solid black" onResizeColumn={(name, width) => {console.log(name,width)}} headers={[
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
          {
            name: "d",
            label: <div className={styles.listViewCloumn}>D</div>,
            defaultWidth: 150,
          },
          {
            name: "e",
            label: <div className={styles.listViewCloumn}>E</div>,
            defaultWidth: 150,
          },
        ]}>
          {(data ?? []).map((item, index) => (
            <ListViewRow key={index} >
              <ListViewItem name="a">
                <div className={styles.listViewCell}>{item.a}</div>
              </ListViewItem>
              <ListViewItem name="b">
                <div className={styles.listViewCell}>{item.b}</div>
              </ListViewItem>
              <ListViewItem name="c">
                <div className={styles.listViewCell}>{item.c}</div>
              </ListViewItem>
              <ListViewItem name="d">
                <div className={styles.listViewCell}>{item.d}</div>
              </ListViewItem>
              <ListViewItem name="e">
                <div className={styles.listViewCell}>{item.e}</div>
              </ListViewItem>
            </ListViewRow>
          ))}
        </ListView>
      </div>
    </PageLayout>
  );
}