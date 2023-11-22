import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { currencyFormatter, removeUnderScore } from "util/helpers";

const InvoiceTable = ({ tableHead, data, pageNumber, perPageData }) => {
  // Create styles
  const tableStyles = StyleSheet.create({
    table: {
      display: "table",
      marginBottom: "20px",
      width: "95%",
      height: "40%",
      borderBottom: "1px solid black",
      overflow: "hidden",
      marginLeft: "auto",
      marginRight: "auto",
    },
    colSize5: {
      width: "6%",
    },
    colSize10: {
      minWidth: "10%",
    },
    colSize50: {
      minWidth: "50%",
    },
    border: {
      border: "1px solid black",
    },
    textCenter: {
      textAlign: "center",
    },
    textLeft: {
      textAlign: "left",
    },
    marginTop: {
      marginTop: "20px",
    },
    marginBottom: {
      marginTop: "20px",
    },
    marginLeftRight: {
      marginLeft: "20px",
      marginRight: "20px",
    },
    textUpperCase: {
      textTransform: "uppercase",
    },
  });
  const tHeadStyles = StyleSheet.create({
    tHead: {
      margin: "0px",
      flexDirection: "row",
    },
    tHeadCol: {
      display: "flex",
      width: "11%",
      alignItems: "center",
      backgroundColor: "#cc6f26",
      padding: "5px",
      color: "#fff",
    },
    tHeadCell: {
      margin: "auto",
      marginTop: 0,
      fontSize: 10,
      textAlign: "center",
      width: "100%",
      fontWeight: "bold",
      color: "#fff",
      verticalAlign: "middle",
    },
  });
  const tRowStyles = StyleSheet.create({
    tRow: {
      margin: "0px",
      flexDirection: "row",
      marginBottom: "8px",
    },
    tRowCol: {
      display: "flex",
      width: "11%",
      height: "100%",
      padding: "5px",
      alignItems: "center",
      backgroundColor: "#eee",
    },
    tRowCell: {
      margin: "auto",
      marginTop: 0,
      fontSize: 10,
      textAlign: "left",
      width: "100%",
      verticalAlign: "middle",
    },
  });

  const {
    table,
    colSize50,
    border,
    colSize5,
    textCenter,
    textLeft,
    marginLeftRight,
    marginBottom,
    marginTop,
    textUpperCase,
  } = tableStyles;
  const { tHead, tHeadCol, tHeadCell } = tHeadStyles;
  const { tRow, tRowCol, tRowCell } = tRowStyles;


  return (
    <View style={[table, marginBottom, marginTop]}>
      <View style={[tHead]}>
        <View style={[tHeadCol, colSize5]}>
          <Text style={[tHeadCell]}>No.</Text>
        </View>
        <View style={[tHeadCol, colSize50]}>
          <Text style={[tHeadCell, textLeft]}>Name</Text>
        </View>
        {tableHead.map((item, index) => (
          <View key={index} style={[tHeadCol]}>
            <Text style={[tHeadCell]}>{item}</Text>
          </View>
        ))}
      </View>

      {data.map((item, index) => (
        <View key={item.id} style={[tRow]}>
          <View style={[tRowCol, colSize5]}>
            <Text style={[tRowCell, textCenter]}>
              {index + 1 + (pageNumber - 1) * perPageData}
            </Text>
          </View>
          <View style={[tRowCol, colSize50]}>
            <Text style={[tRowCell, textLeft]}>{item.original_file_name}</Text>
          </View>
          <View key={item.id} style={[tRowCol]}>
            <Text style={[tRowCell, textCenter, textUpperCase]}>
              {removeUnderScore(item?.file_type??"")}
            </Text>
          </View>
          <View key={item.id} style={[tRowCol]}>
            <Text style={[tRowCell, textCenter]}>{item.file_deliver_date}</Text>
          </View>
          <View key={item.id} style={[tRowCol]}>
            <Text style={[tRowCell, textCenter]}>{item.file_page_count}</Text>
          </View>
          <View key={item.id} style={[tRowCol]}>
            <Text style={[tRowCell, textCenter]}>
              {currencyFormatter(item?.file_estimate_cost)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default InvoiceTable;
