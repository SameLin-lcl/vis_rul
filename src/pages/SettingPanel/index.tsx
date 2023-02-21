// @ts-nocheck
import React, { useEffect, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import { FONT_SIZE } from "../../style";
import { Button, Card, CardProps, Form, Select, Slider } from "antd";
import { ScatterChart } from "./charts";
import { observer } from "mobx-react";
import * as d3 from "d3";

const MyCard = (props: CardProps): Element => {
  const { style, ...rest } = props;

  return (
    <Card
      style={{
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
        ...style
      }}
      size={"small"}
      bodyStyle={{ flex: 1, padding: 0 }}
      headStyle={{ minHeight: 18 }}
      {...rest}
    >
      {props.children}
    </Card>
  );
};

export default observer(function SettingPanel(props: any): JSX.Element {
  const { containerStyle, globalData } = props;

  const [form] = Form.useForm();
  const [dataset, setDataSet] = useState({
    name: "FD0001",
    trainUnits: 67,
    testUnits: 33
  });

  useEffect(() => {
    void globalData.updateModels([]).then((data) => {
      form.setFieldsValue({
        models: data.models.map((item) => item.model)
      });
    });
    void globalData.updateUnits().then((data) => {
      form.setFieldsValue({
        rul: [data.maxMin.rul.min, data.maxMin.rul.max]
      });
    });
  }, []);

  const handleSelectUnit = (): void => {
    const selectedUnitIds = [];
    d3.selectAll(".unit-pca.selected-unit").each(function (e) {
      selectedUnitIds.push(d3.select(this).attr("data-id"));
    });
    globalData.updateSelectedUnits(selectedUnitIds);
  };

  const handleSubmit = (): void => {
    const { models, rul } = form.getFieldsValue();
    globalData.updateUnits({ rul });
  };

  return (
    <ViewContainer title={"Control"} containerStyle={containerStyle}>
      <div
        style={{
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          padding: "30px 10px 0px 10px",
          fontSize: FONT_SIZE * 1.6
        }}
      >
        <MyCard
          title={"setting"}
          bodyStyle={{ padding: "5px 20px" }}
          extra={
            <Button size="small" type={"text"} onClick={handleSubmit}>
              submit
            </Button>
          }
        >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
            onValuesChange={({ rul, models }) => {
              //
            }}
          >
            <Form.Item style={{ marginBottom: 0 }} label={"datasets"}>
              <Form.Item name={"datasets"} initialValue={dataset.name} noStyle>
                <Select
                  // style={{ width: "calc(100% - 100px)" }}
                  size={"small"}
                  options={[{ value: dataset.name }]}
                />
              </Form.Item>
              <span className="ant-form-text" style={{ marginLeft: 8 }}>
                train-units: {dataset.trainUnits} / test-units:{" "}
                {dataset.testUnits}
              </span>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              name={"models"}
              label={"models"}
            >
              <Select
                maxTagCount={3}
                mode={"multiple"}
                size={"small"}
                options={globalData._models.map((item) => ({
                  value: item
                }))}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }} name="rul" label="RUL">
              <Slider
                range
                max={globalData.unitsMaxMin?.rul?.max}
                min={globalData.unitsMinMin?.rul?.min}
                size={"small"}
                marks={{
                  [globalData.unitsMaxMin?.rul?.min]:
                    globalData.unitsMaxMin?.rul?.min,
                  [globalData.unitsMaxMin?.rul?.max]:
                    globalData.unitsMaxMin?.rul?.max
                }}
              />
            </Form.Item>
          </Form>
        </MyCard>

        <MyCard
          style={{ flex: 1 }}
          title={"units"}
          extra={
            <Button size="small" type={"text"} onClick={handleSelectUnit}>
              submit
            </Button>
          }
        >
          <ScatterChart
            units={globalData.units}
            unitsMaxMin={globalData.unitsMaxMin}
          />
        </MyCard>
        {/* <MyCard title={"features"}> */}
        {/*  <BarChart /> */}
        {/* </MyCard> */}
      </div>
    </ViewContainer>
  );
});
