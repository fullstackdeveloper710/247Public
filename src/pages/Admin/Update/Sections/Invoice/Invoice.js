import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { MainLogo } from "assets/images";
import { INVOICE_TITLE } from "constants/title";
import InvoiceTable from "./InvoiceTable";
import { currencyFormatter } from "util/helpers";

const Invoice = ({
  data,
  total_amount,
  saving_amount,
  final_payble_amount,
  perPageData,
  order_invoice_number,
  order_generate_date,
  address,
}) => {
  // Create styles

  const commonStyles = StyleSheet.create({
    pageStyle: {
      flexDirection: "column",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      section: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "2%",
        borderBottom: "1px solid black",
        paddingBottom: "2%",
        display: "flex",
        section_left: {
          width: "70%",
        },
        section_right: {
          width: "30%",
          display: "flex",
          justifyContent: "flex-end",
          datecolor: {
            fontWeight: "600",
            color: "#000",
            fontSize: "10px",
          },
          totalamount: {
            textAlign: "right",
          },
          flexsec: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "150px",
          },
          totallabel: {
            textAlign: "left",
            width: "40%",
          },
          labelheading: {
            textAlign: "left",
            width: "45%",
          },
          divider: {
            width: "10%",
            marginRight: "5%",
          },
        },
      },
      footer_section: {
        position: "absolute",
        bottom: "-30px",
        footer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#cc6f26",
          width: "100%",
          height: "50px",
        },
        footerheading: {
          fontSize: "12px",
        },
        pageNo: {
          fontSize: "10px",
        },
      },
    },

    topbar: {
      backgroundColor: "#cc6f26",
      height: "10px",
    },
    marginTop: {
      marginTop: "20px",
    },
    marginLeftRight: {
      marginLeft: "20px",
      marginRight: "20px",
    },
    borderNone: {
      border: "none",
    },
  });
  const styles = StyleSheet.create({
    logo: {
      width: 150,
      objectFit: "cover",
      marginTop: "12px",
    },

    heading: {
      fontSize: "12px",
      marginBottom: "5px 0px",
    },
    p: {
      fontSize: "8px",
      margin: "5px 0px",
    },
    note: {
      width: "70%",
      fontSize: "10px",
    },
  });
  const { logo, heading, p, note } = styles;

  const { pageStyle, marginTop, marginLeftRight, borderNone, topbar } =
    commonStyles;
  const { section, footer_section } = pageStyle;
  const { section_left, section_right } = section;
  const { footer, pageNo, footerheading } = footer_section;
  const { datecolor, totalamount, flexsec, totallabel, labelheading, divider } =
    section_right;
  // Create Document Component

  const tableHead = ["Type", "Delivery", "Pages", "Cost"];
  return (
    <Document title={INVOICE_TITLE}>
      {data.map((page, index) => {
        return (
          <Page
            size="A4"
            style={pageStyle}
            wrap
            key={index}
            pageNumber={index + 1}
          >
            <View style={[topbar]}></View>
            <View style={[section, marginTop, marginLeftRight]} fixed>
              <View style={section_left}>
                <Image style={logo} src={MainLogo} />
              </View>
              <View style={section_right}>
                <Text style={heading}>247 Accessible Documents Pte. Ltd.</Text>
                <Text style={p}>100 Cecil Street,</Text>
                <Text style={p}>#15-02, The Globe,</Text>
                <Text style={p}>Singapore</Text>
                <Text style={p}>069532</Text>
              </View>
            </View>
            <View style={[section, marginLeftRight]} fixed>
              <View style={section_left}>
                <Text style={p}>
                  BILL TO: <Text style={p}>{address?.org_name ?? ""}</Text>
                </Text>
                <Text style={p}>
                  Address:{" "}
                  <Text style={p}>{`${address?.address1 ?? "" + ","}${
                    address?.address2 ?? "" + ","
                  }${address?.city ?? "" + ","}${address?.state ?? "" + ","}${
                    address?.country ?? "" + ","
                  }`}</Text>
                </Text>
                <Text style={p}>
                  Postal: <Text style={p}>{address?.postal_code ?? ""}</Text>
                </Text>
              </View>
              <View style={section_right}>
                <Text style={p}>
                  INVOICE #:{" "}
                  <Text style={datecolor}>{order_invoice_number}</Text>
                </Text>
                <Text style={p}>
                  DATE: <Text style={datecolor}>{order_generate_date}</Text>
                </Text>
              </View>
            </View>
            <InvoiceTable
              tableHead={tableHead}
              data={page}
              pageNumber={index + 1}
              perPageData={perPageData}
            />
            <View style={[section, borderNone, marginLeftRight, marginTop]}>
              <View style={section_left}>
                {/* <Text style={heading}>NOTE:-</Text> */}
                {/* <Text style={note}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text> */}
              </View>
              {index === data.length - 1 && (
                <View style={[section_right, totalamount]}>
                  <View style={[flexsec]}>
                    <Text style={[p, totallabel]}>TOTAL</Text>
                    <Text style={[divider]}>:</Text>
                    <Text style={[labelheading]}>
                      {currencyFormatter(total_amount)}
                    </Text>
                  </View>
                  <View style={[flexsec]}>
                    <Text style={[p, totallabel]}> DISCOUNT</Text>
                    <Text style={[divider]}>:</Text>
                    <Text style={[labelheading]}>
                      {currencyFormatter(saving_amount)}
                    </Text>
                  </View>
                  <View style={[flexsec]}>
                    <Text style={[p, totallabel]}> PAYABLE</Text>
                    <Text style={[divider]}>:</Text>
                    <Text style={[labelheading]}>
                      {currencyFormatter(final_payble_amount)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={[section, footer_section]} fixed>
              <View style={footer}>
                {/* <Text style={footerheading}>
                  Powered By 24/7 Accessible Documents
                </Text> */}
                <Text style={pageNo}>
                  Page {index + 1} of {data.length}
                </Text>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default Invoice;
