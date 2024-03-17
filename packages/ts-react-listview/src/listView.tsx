import lodash from "lodash";
import React from "react";

import styles from "./listView.module.scss";


const getId = (i => () => i++)(1);

export const ListView = function(
  props: {
    headers: {
      name: string,
      label: React.ReactNode,
      defaultWidth: number,
    }[],
    children: React.ReactElement<ListViewRowProps, typeof ListViewRow>[] |  React.ReactElement<ListViewRowProps, typeof ListViewRow>
  }
)
{
  //■画面上に複数使用された場合に備えて、クラス名などに使用する一意な値を採番する。
  const componentId = React.useMemo(() => `listview_${String(getId())}`, []);


  //■childrenを配列に展開する。
  const rows = lodash.isArray(props.children) ? props.children : [props.children];

  //■スクロールのコントロール
  const headerContainerElement = React.useRef<HTMLDivElement>(null);//ヘッダコンテナ
  const contentsContainerElement = React.useRef<HTMLDivElement>(null);//コンテンツコンテナ
  const scrollXContainerElement = React.useRef<HTMLDivElement>(null);//横スクロールバーコンテナ
  const scrollYContainerElement = React.useRef<HTMLDivElement>(null);//縦スクロールバーコンテナ
  const contentsElement = React.useRef<HTMLDivElement>(null);//コンテンツエリア
  const scrollXContentElement = React.useRef<HTMLDivElement>(null);//横スクロールバーエリア
  const scrollYContentElement = React.useRef<HTMLDivElement>(null);//縦スクロールバーエリア


  //■スクロールバーエリアのサイズをコンテンツのサイズに合わせるメソッド
  const resetSize = () => {
    if(contentsElement.current != null){
      if(scrollYContentElement.current != null){
        scrollYContentElement.current.style.height = `${contentsElement.current.clientHeight}px`;
      }
      if(scrollXContentElement.current != null){
        scrollXContentElement.current.style.width = `${contentsElement.current.clientWidth}px`;
      }
    }
  }
  //■ウィンドウサイズの変更ベントで、スクロールバーエリアのサイズを調整する
  React.useEffect(() => {
    resetSize();
    
    const onWindowResize = (e: any) => {
      resetSize();
    };
    window.addEventListener("resize", onWindowResize);
    return ()=>{ 
      window.removeEventListener('resize', onWindowResize);
    };

  }, []);


  //■スクロールエリアのスクロール状態をコンテンツエリアのスクロール状態に反映させるメソッド
  //※
  const scrollTo = (x: number, y: number) => {
    if(headerContainerElement.current == null || contentsContainerElement.current == null || scrollXContainerElement.current == null || scrollYContainerElement.current == null)return;
    if(headerContainerElement.current.scrollLeft != x)headerContainerElement.current.scrollLeft = x;
    if(contentsContainerElement.current.scrollLeft != x)contentsContainerElement.current.scrollLeft = x;
    if(contentsContainerElement.current.scrollTop != y)contentsContainerElement.current.scrollTop = y;
    if(scrollXContainerElement.current.scrollLeft != x)scrollXContainerElement.current.scrollLeft = x;
    if(scrollYContainerElement.current.scrollTop != y)scrollYContainerElement.current.scrollTop = y;
  };

  //■横スクロールの位置を取得するメソッド
  const getScrollLeft = (): number => contentsContainerElement.current == null ? 0 :contentsContainerElement.current.scrollLeft;

  //■立てスクロールの位置を取得するメソッド
  const getScrollTop = (): number => contentsContainerElement.current == null ? 0 : contentsContainerElement.current.scrollTop;

  

  //■コンテンツの生成
  //※下記のような構造
  // A B   A: 列ヘッダ, B: 余白
  // C D   C: コンテンツ, D: 縦スクロールバー
  // E F   E: 横スクロールバー, F: 余白
  return (
    <div className={styles.root}>
      <div> {/* ヘッダコンテナと余白 */}
        <div ref={headerContainerElement} onScroll={e => {scrollTo(e.currentTarget.scrollLeft, getScrollTop())}}>{/* ヘッダコンテナ */}
          {props.headers.map((item, index) => {//カラムを展開
            return(
              <HeaderItem key={index} className={`className${componentId}_${item.name}`} defaultWidth={item.defaultWidth} onWidthChange={(width, className) => {resetSize();}}>
                <div className={styles.headerLabel}>
                  {item.label}
                </div>
              </HeaderItem>
            );
          })}
        </div>
        <div/>{/* 余白 */}
      </div>
      <div> {/* コンテンツコンテナと縦スクロールコンテナの横並び */}
        <div ref={contentsContainerElement} onScroll={e => {scrollTo(e.currentTarget.scrollLeft, e.currentTarget.scrollTop)}}>{/* コンテンツコンテナ */}
          <div ref={contentsElement}>
            {rows.map((row: React.ReactElement<any, string | React.JSXElementConstructor<any>>, index) => {
              const cells = lodash.isArray(row.props.children) ? row.props.children as React.ReactElement[] : [row.props.children as React.ReactElement];
  
              return (
                <div key={index} className={styles.row}>
                  {props.headers.map((header, index) => {
                    const cell = cells.find(cell => cell.props.name == header.name);
                    return(
                      <div key={index} className={`${styles.cell} className${componentId}_${header.name}`}>
                        {cell != null ? cell.props.children : ""}
                      </div>
                    );
                  })}

                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div ref={scrollYContainerElement} onScroll={e => {scrollTo(getScrollLeft(), e.currentTarget.scrollTop)}}>{/* 縦スクロールコンテナ*/}
            <div ref={scrollYContentElement} />
          </div>
        </div>
      </div>
      <div>{/* 横スクロールコンテナと余白 */}
        <div ref={scrollXContainerElement} onScroll={e => {scrollTo(e.currentTarget.scrollLeft, getScrollTop())}}>{/* 横スクロールコンテナ*/}
          <div ref={scrollXContentElement} />
        </div>
        <div />{/* 余白 */}
      </div>
    </div>
   
  );
};

/**
 * カラムを描画する。カラムそのものと、マウスによる幅の変更操作をサポート。
 * @param props 
 * @returns 
 */
const HeaderItem = function(
  props: {
    className: string,
    defaultWidth: number,
    onWidthChange?: (width: number, className: string) => void,
    children: React.ReactElement,
  }
) 
{
  
  const [width, setWidth] = React.useState(props.defaultWidth);
  const [dragStartData, setDragStartData] = React.useState<{width: number, point: number} | null>(null);
  const controllerRef = React.useRef<HTMLDivElement | null>(null);

  //■childrenをporpsに、style属性のwidthを変更した新しいchildrenを再構築
  const newProps = { ...props.children.props}; 
  const newStyle = newProps["style"] == null ? {} : lodash.cloneDeep(newProps["style"]);
  newStyle["width"] = (width - 10) + "px";
  newProps["style"] = newStyle;
  const newChild = React.cloneElement(props.children, newProps)


  //■カラム幅の変更のためのマウスイベントの設定
  const onMouseDown  = (event: MouseEvent) => {
    if(controllerRef.current != null && controllerRef.current.contains(event.target as Node)){
      setDragStartData({width: width, point: event.screenX});
    }
  }
  const onMouseMove  = (event: MouseEvent) => {
    if(dragStartData != null){
      const newWidth = dragStartData.width + (event.screenX - dragStartData.point);
      setWidth(newWidth);
      
    }
  }
  const onMouseUp  = (event: MouseEvent) => {
    if(dragStartData != null){
      setDragStartData(null);
      if(props.onWidthChange != null)
        props.onWidthChange(width, props.className);
    }
  }

  React.useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseUp);
    return function cleanup() {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
    };
  }, [controllerRef.current, dragStartData])
  
  return (
    <>
      <style>{`.${props.className}{width: ${width}px;}`}</style>{/* <style>を出力する。このクラス名はコンテンツ内のセルが買う徴することで、ヘッダの長さとセルの長さが同期される */}
      
      {dragStartData != null ? //ドラック中のテキスト選択を禁止
        <style>{`
          * {
            -webkit-user-select: none;  /* Chrome or Safari */
            -moz-user-select: none;     /* FireFox */
            -ms-user-select: none;      /* IE */
            -o-user-select: none;       /* Opera */
            user-select: none;
          }
        `}</style>
        : <></>
      }
      <div className={styles.headerRoot} style={{width: width}}>
        <div>{newChild}</div> {/* カラム */}
        <div><div ref={controllerRef} /></div>{/* マウスの操作を受け付けるエリア */}
      </div>
    </>
  );
}

//■ListViewの子供に指定するListViewRow
type ListViewRowProps =  {
  children: React.ReactElement<ListViewItemProps, typeof ListViewItem>[] |  React.ReactElement<ListViewItemProps, typeof ListViewItem>
};
export const ListViewRow = function(
  props: ListViewRowProps,
){
  return <></>;
}

//■ListViewRowの子供に指定するListViewItem
type ListViewItemProps = {
  name: string,
  children: React.ReactNode,
}
export const ListViewItem = function(
  props: ListViewItemProps
){
  return <></>;
}
