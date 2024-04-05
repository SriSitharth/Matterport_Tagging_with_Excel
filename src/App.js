import { useEffect, useRef, useState } from "react";
import "./App.css";
import { setupSdk } from "@matterport/sdk";
import * as XLSX from 'xlsx';
import ExcelFile from './Tags.xlsx';
import { Button, Drawer , Table } from 'antd';

function App() {
  const [sdk, setSdk] = useState();
  const container = useRef(null);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [tagid, setTagId] = useState([]);

  useEffect(() => {
    const readExcelFile = async () => {
      try {
        const response = await fetch(ExcelFile);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parseData = XLSX.utils.sheet_to_json(sheet);
        setData(parseData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    }
    readExcelFile();
    setupSdk("p4ubmh4wzy0pseeh4tftn59db", {
      container: container.current,
      space: "ABM4KEGEnEg",
      iframeQueryParams: { qs: 1 },
    }).then(setSdk);
  }, []);
  
  const navigateToTag = (tagId) => {
      sdk.Mattertag.navigateToTag(tagId, sdk.Mattertag.Transition.INSTANT);
  };

  const addTags = () => {
    var mattertags = data.map((item,index) => ({
      label: item.Name,
      description: item.Price +"  [Buy](item.Url)",
      anchorPosition: { x: item.x, y: item.y, z: item.z},
      stemVector: { x: 0, y: 0, z: 0 },
      color: { r: 1, g: 0, b: 0 }
    }));

    sdk.Mattertag.add(mattertags).then(function (mattertagIds) {
      setTagId(mattertagIds);
    })
  }
  
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigateToTag(tagid[record.key])}>{text}</a>
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'link',
      dataIndex: 'address',
      key: 'address',
    }];

    const tabledata = data.map((item, index) => ({
        key: index.toString(),
        name: item.Name,
        age: item.Price,
        address: item.Url,
      }));

  return (
    <div className="app">
      <div className="container" ref={container}></div>
      <Button type="primary" onClick={addTags} className="tag_btn">Tags</Button>
      <Button type="primary" onClick={showDrawer} className="drawer_btn">Menu</Button>
      <Drawer title="All Tags" onClose={onClose} open={open} mask={false}>
        <Table columns={columns} dataSource={tabledata} />
      </Drawer>
    </div>
  );
}

export default App;