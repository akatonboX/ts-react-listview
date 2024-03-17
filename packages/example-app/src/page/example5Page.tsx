import React from 'react';
import { PageLayout } from '../layout/pageLayout';
import styles from "./example5Page.module.scss";
import { ListView, ListViewItem, ListViewRow } from 'ts-react-listview';
export function Example5Page(
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
    <PageLayout title="Example1">
      <div>
        <div style={{width: 200, height:200}}>
          <ListView headers={[
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
              </ListViewRow>
            ))}
          </ListView>
        </div>
      </div>
    </PageLayout>
  );
}