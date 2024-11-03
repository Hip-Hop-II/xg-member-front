import dayjs from "dayjs";

export const convertArea = (data) => {
    const columns = [];
    const areaObj = {};
    data.forEach(item => {
        let province = areaObj[item.provinceCode];
        if (!province) {
            province = {
                label: item.provinceName,
                value: item.provinceCode,
                children: {}
            };
        }
        let city = province.children[item.cityCode];
        if (!city) {
            city = {
                label: item.cityName,
                value: item.cityCode,
                children: {}
            };
        }
        let county = city.children[item.countyCode];
        if (item.countyCode && !county) {
            county = {
                label: item.countyName,
                value: item.countyCode
            };
            city.children[item.countyCode] = county;
        }

        province.children[item.cityCode] = city;
        areaObj[item.provinceCode] = province;
    });

    Object.keys(areaObj).forEach(provinceCode => {
        const column = areaObj[provinceCode];
        column.children = Object.keys(column.children).map(cityCode => column.children[cityCode]);
        column.children.forEach(city => {
            city.children = Object.keys(city.children).map(countyCode => city.children[countyCode]);
        });
        columns.push(column);
    });
    return columns;
};

export function timestampToDate(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
    if (!timestamp) return "";
    if (typeof timestamp === "string") timestamp = Number(timestamp);
    return dayjs(timestamp).format(format);
}
/**
 * 分转元
 */
export const convertFenToYuan = (val) => {
    if(typeof val !== "number" ) return val
    return (val / 100).toFixed(2);
};

export const convertIndustry = (items) => {
  const level1Map = {};

  items.forEach(({ mccLevel1Name, mccLevel2Name, mccName, mccCode }) => {
    // 如果第一级类别不存在，则初始化
    if (!level1Map[mccLevel1Name]) {
      level1Map[mccLevel1Name] = {
        label: mccLevel1Name,
        value: mccLevel1Name,
        children: {},
      };
    }

    const level1 = level1Map[mccLevel1Name];

    // 如果第二级类别不存在，则初始化
    if (!level1.children[mccLevel2Name]) {
      level1.children[mccLevel2Name] = {
        label: mccLevel2Name,
        value: mccLevel2Name,
        children: [],
      };
    }

    // 添加第三级服务
    level1.children[mccLevel2Name].children.push({
      label: mccName,
      value: mccCode,
    });
  });

  // 将嵌套的对象转换为数组结构
  return Object.values(level1Map).map(level1 => ({
    ...level1,
    children: Object.values(level1.children),
  }));
};
