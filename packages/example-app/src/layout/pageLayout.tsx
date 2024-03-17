import React from "react";
import styles from './pageLayout.module.scss';
import { useNavigate } from "react-router-dom";

export const PageLayout = (
  props: {
    title?: string,
    initialized?: boolean,
    children: React.ReactNode
  }
) => {
  const initialized = props.initialized ?? true;
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.root}>
        <div>{/*ヘッダ-*/}
          <button onClick={e =>{e.preventDefault();navigate("/example1")}}>example1</button>
        </div>
        <div>{/*コンテンツ*/}
          
          <div>{/*ページヘッダ*/}
            <span><b>{props.title}</b></span> 
          </div>
          <div>{/*ページコンテンツ*/}
            <div>
              {initialized ? props.children : <></>}
            </div>
          </div>
        </div>
        <div>{/*フッタ*/}
          Copyright © 株式会社アーカイブ All Rights Reserved.
        </div>
      </div>

    </>
  );
}