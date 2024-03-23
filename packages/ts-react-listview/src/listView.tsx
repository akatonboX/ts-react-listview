import lodash from "lodash";
import React, { CSSProperties } from "react";


import styles from "./listView.module.scss";

const getId = (i => () => i++)(1);


export const ListView = function(
  props: {
    headers: {
      name: string,
      label: React.ReactNode,
      defaultWidth: number,
    }[],
    hasRowHeader?: boolean;
    rowHeaderWidth?: number,
    rowHeight?: number,
    verticvalLineStyle?: CSSProperties["border"],
    horizontalLineStyle?: CSSProperties["border"],
    resizeColumnEnabled?: boolean;
    onResizeColumn?: (name: string, newWidth: number) => void;
    children: React.ReactElement<ListViewRowProps, typeof ListViewRow>[] |  React.ReactElement<ListViewRowProps, typeof ListViewRow>
  }
)
{
  //■propsの初期値を決定
  const rowHeaderWidth = props.rowHeaderWidth ?? 50;
  const hasRowHeader = props.hasRowHeader ?? false;
  const rowHeight = props.rowHeight ?? (hasRowHeader ? 30 : undefined);//指定がなく、行ヘッダをサポートするなら、30pxにする。
  const verticvalLineStyle = props.verticvalLineStyle;
  const horizontalLineStyle = props.horizontalLineStyle ?? "solid 1px lightgray";
  const resizeColumnEnabled = props.resizeColumnEnabled ?? true;
  const onResizeColumn = props.onResizeColumn ?? ((name: string, column: number) => {});

  //■画面上に複数使用された場合に備えて、クラス名などに使用する一意な値を採番する。
  const componentId = React.useMemo(() => `listview_${String(getId())}`, []);

  //■childrenを配列に展開する。
  const rows = lodash.isArray(props.children) ? props.children : [props.children];
  const rowProps = lodash.isArray(props.children) ? props.children.map(item => item.props) : [props.children.props];

  //■エレメント
  const columnHeaderContetntElement = React.useRef<HTMLDivElement>(null);//列ヘッダコンテンツ
  const rowHeaderContetntElement = React.useRef<HTMLDivElement>(null);//行ヘッダコンテンツ

  //■スクロールエリアのスクロール状態をコンテンツエリアのスクロール状態に反映させるメソッド
  //※
  const scrollTo = (x: number, y: number) => {
    if(columnHeaderContetntElement.current == null || rowHeaderContetntElement.current == null)return;
    columnHeaderContetntElement.current.style.marginLeft = `${x * -1}px`;
    rowHeaderContetntElement.current .style.marginTop = `${y * -1}px`;
  };

  //■コンテンツの生成
  //※下記のような構造
  // A B   A: 余白, B: 列ヘッダ
  // C D   C: 行ヘッダ, D: コンテンツ
  return (
    <div className={styles.root}>
      <div> {/* A: 余白, B: 列ヘッダ */}
        <div style={{width: rowHeaderWidth, display: hasRowHeader ? "block" : "none"}}/>{/* A: 余白 */}
        <div ref={columnHeaderContetntElement}>{/* B: 列ヘッダ */}
          {props.headers.map((item, index) => {//カラムを展開
            return(
              <HeaderItem key={index} className={`className${componentId}_${item.name}`} defaultWidth={item.defaultWidth} resizeColumnEnabled={resizeColumnEnabled} onWidthChange={(width, className) => {onResizeColumn(item.name,width);}}>
                <div className={styles.headerLabel}>
                  {item.label}
                </div>
              </HeaderItem>
            );
          })}
        </div>
      </div>
      <div> {/* C: 行ヘッダ, D: コンテンツ */}
        <div style={{width: rowHeaderWidth, display: hasRowHeader ? "block" : "none"}} onScroll={e => {scrollTo(e.currentTarget.scrollLeft, e.currentTarget.scrollTop)}}>{/* 行ヘッダコンテナ */}
          <div>
            <div ref={rowHeaderContetntElement}>
              {hasRowHeader ? 
                rowProps.map((rowProp, index) => {
                  return <div key={index} style={{height: rowHeight}}>{rowProp.header}</div>;//セル
                }) : <></>
              }
            </div>
          </div>
        </div>
        <div>{/* コンテンツコンテナ */}
          <div onScroll={e => {scrollTo(e.currentTarget.scrollLeft, e.currentTarget.scrollTop)}}>
            <div >
              {rows.map((row: React.ReactElement<any, string | React.JSXElementConstructor<any>>, index) => {
                const cells = lodash.isArray(row.props.children) ? row.props.children as React.ReactElement[] : [row.props.children as React.ReactElement];
                return (

                  <div key={index} className={styles.row} style={{height: rowHeight, borderBottom: horizontalLineStyle}}>
                    {props.headers.map((header, index) => {
                      const cell = cells.find(cell => cell.props.name == header.name);
                      return(
                        <div key={index} className={`${styles.cell} className${componentId}_${header.name}`} style={{borderLeft: index === 0 ? verticvalLineStyle : undefined, borderRight: verticvalLineStyle}}>
                          {cell != null ? cell.props.children : <></>}
                        </div>
                      );
                    })}

                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
    resizeColumnEnabled: boolean,
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
      const newWidth = dragStartData.width + (event.screenX - dragStartData.point);
      setDragStartData(null);
      if(props.onWidthChange != null)
        props.onWidthChange(newWidth, props.className);
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
      <div className={styles.HeaderItemRoot} style={{width: width}}>
        <div>{newChild}</div> {/* カラム */}
        {/* マウスの操作を受け付けるエリア */}
        {props.resizeColumnEnabled ?
        <div className={styles.resize}><div ref={controllerRef} /></div>
        : <></>}
      </div>
    </>
  );
}

//■ListViewの子供に指定するListViewRow
type ListViewRowProps =  {
  header?: React.ReactNode,
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
