import React, { useState } from 'react';
import './App.css';
import MaterialTable from 'material-table'
import axios from 'axios'
import XLSX from 'xlsx'
import * as column from '../src/column'
let jsonData=undefined
const EXTENSIONS = ['xlsx', 'xls', 'csv','XLSX', 'XLS', 'CSV']
const baseUrl='http://127.0.0.1:8000/dryout/api/'
function App() {
  const [colDefs, setColDefs] = useState()
  const [data, setData] = useState()
  let fileExtentionCheck=true;

  const getExention = (files) => {

    Object.entries(files).forEach(
      ([key, value]) => {
      const parts = value.name.split('.')
      const extension = parts[parts.length - 1]
      fileExtentionCheck=fileExtentionCheck && EXTENSIONS.includes(extension)
      }
  );
    return fileExtentionCheck
    // return EXTENSIONS.includes(extension) // return boolean
  }

  const handleAdd=async (str)=>{
    console.log('jsonData',jsonData);
    // const obj={Name:"Muniyappan",Age:"28"}
    const url=baseUrl+str+`/`;
    const response=await jsonData.map((data)=>axios.post(url,data))
    console.log(response);
    // const temp=[response.data,...this.state.data]
    // this.setState({data: temp});
    // if (this.state.data.length===1) this.getRestAPi();
  }

  const convertToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
      let rowData = {}
      row.forEach((element, index) => {
        rowData[headers[index]] = element!==""?element:"-"
      })
      rows.push(rowData)

    });
    return rows
  }

  const fileRead=(value)=>{
    const reader = new FileReader()
    reader.readAsBinaryString(value);
    reader.onload = (event) => {
      
      //parse data
      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" })
      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
      // console.log(fileData)
      const headers = fileData[0]
      const heads = headers.map(head => ({ title: head.replaceAll(".", "")  , field: head.replaceAll(".", "") }))
      const headCompare=headers.map(head => head.replaceAll(".", ""));
      setColDefs(heads)

      //removing header
      fileData.splice(0, 1)

      jsonData=convertToJson(headers, fileData)
      setData(jsonData)
      console.log("data",jsonData);
      // column.Columns.forEach((currentValue, index)=>{
      //   let headCompareBool=true;
      //   currentValue.map(col=>{
      //     headCompareBool=headCompareBool && headCompare.includes(col);
      //   });
      //   if (headCompareBool)handleAdd(column.tableName[index]);
      // })
    }
  }

  const importExcel = (e) => {
    // const file = e.target.files[0]
    const files = e.target.files
    console.log('files',e.target.files);
    if (files) {
      if (getExention(files)) {
        alert("all files ok");
        Object.entries(files).forEach(
          ([key, value]) => {
            fileRead(value);
          }
      );
      }
      else {
        alert("Invalid file input, Select Excel, CSV file")
      }
    } else {
      setData([])
      setColDefs([])
    }
  }

  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <h4 align='center'>Import Data from Excel, CSV in Material Table</h4>
      <input type="file" onChange={importExcel} multiple/>
      {/* <button onClick={}></button> */}
      <MaterialTable title="Olympic Data" data={data} columns={colDefs} />
    </div>
  );
}

export default App;
