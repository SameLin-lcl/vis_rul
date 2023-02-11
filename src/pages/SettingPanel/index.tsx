// @ts-nocheck
import React from "react";
import ViewContainer from "../components/ViewContainer";
import { FONT_SIZE } from "../../style";
import { Card, CardProps, Form, Select, Slider } from "antd";
import { BarChart, ScatterChart } from "./charts";

const MyCard = (props: CardProps): Element => {
  return (
    <Card
      style={{
        marginBottom: 10,
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
      size={"small"}
      bodyStyle={{ flex: 1, padding: 0 }}
      headStyle={{ minHeight: 18 }}
      {...props}
    >
      {props.children}
    </Card>
  );
};

export default function SettingPanel(props: any): JSX.Element {
  const { containerStyle } = props;

  const [form] = Form.useForm();

  return (
    <ViewContainer title={"Control"} containerStyle={containerStyle}>
      <div
        style={{
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          padding: "30px 20px 20px 20px",
          fontSize: FONT_SIZE * 1.6
        }}
      >
        <MyCard title={"setting"} bodyStyle={{ flex: 1, padding: "5px 20px" }}>
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form}>
            <Form.Item style={{ marginBottom: 0 }} label={"datasets"}>
              <Form.Item name={"datasets"} noStyle>
                <Select
                  style={{ width: "calc(100% - 100px)" }}
                  size={"small"}
                  options={[{ label: "a", value: "a" }]}
                />
              </Form.Item>
              <span className="ant-form-text" style={{ marginLeft: 8 }}>
                units: 111
              </span>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              name={"models"}
              label={"models"}
            >
              <Select
                mode={"multiple"}
                size={"small"}
                options={[{ label: "a", value: "a" }]}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }} name="RUL" label="RUL">
              <Slider
                range
                value={[10, 60]}
                max={110}
                min={0}
                marks={{ 0: "0", 110: "110" }}
              />
            </Form.Item>
          </Form>
        </MyCard>

        <MyCard title={"units"}>
          <ScatterChart />
        </MyCard>
        <MyCard title={"features"}>
          <BarChart />
        </MyCard>
      </div>
    </ViewContainer>
  );
}
