import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

const SIZE = 200;
const RADIUS = SIZE / 2;
const CENTER = SIZE / 2;

function polarToCartesian(angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(angleInRadians),
    y: CENTER + RADIUS * Math.sin(angleInRadians),
  };
}

function arcPath(startAngle, endAngle) {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

/**
 * Gráfico de pizza simples baseado em react-native-svg.
 *
 * @param {{ data: Array<{ label: string, value: number, color: string }> }} props
 * @returns {JSX.Element}
 */
export default function PieChart({ data }) {
  const slices = (data ?? []).filter((d) => d.value > 0);
  const total = slices.reduce((sum, d) => sum + d.value, 0);

  if (total <= 0) {
    return (
      <View style={styles.empty}>
        <Text style={globalStyles.secondaryText}>
          Sem despesas no período para exibir o gráfico.
        </Text>
      </View>
    );
  }

  let cursor = 0;
  const arcs = slices.map((slice) => {
    const startAngle = (cursor / total) * 360;
    cursor += slice.value;
    const endAngle = (cursor / total) * 360;
    return { ...slice, startAngle, endAngle };
  });

  const singleSlice = arcs.length === 1;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <G>
          {singleSlice ? (
            <Circle cx={CENTER} cy={CENTER} r={RADIUS} fill={arcs[0].color} />
          ) : (
            arcs.map((arc) => (
              <Path
                key={arc.label}
                d={arcPath(arc.startAngle, arc.endAngle)}
                fill={arc.color}
              />
            ))
          )}
        </G>
      </Svg>

      <View style={styles.legend}>
        {arcs.map((arc) => {
          const percent = ((arc.value / total) * 100).toFixed(0);
          return (
            <View key={arc.label} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: arc.color }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {arc.label}
              </Text>
              <Text style={styles.legendPercent}>{percent}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 24,
  },
  legend: {
    alignSelf: "stretch",
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendText: {
    flex: 1,
    color: colors.primaryText,
    fontSize: 14,
  },
  legendPercent: {
    color: colors.primaryText,
    fontWeight: "700",
    fontSize: 14,
  },
});
