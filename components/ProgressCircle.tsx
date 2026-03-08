import { Circle } from "react-native-progress";

type Props = {
  progressValue: number;
  size: number;
};

function colorCalculation(value: number) {
  if (value <= 0.2) {
    return "red";
  }
  if (value <= 0.4) {
    return "orange";
  }
  if (value <= 0.6) {
    return "yellow";
  }
  if (value <= 0.8) {
    return "lightgreen";
  }
  return "green";
}

export default function ProgressCircle({ progressValue, size }: Props) {
  return (
    <Circle
      progress={progressValue}
      size={size}
      color={colorCalculation(progressValue)}
      borderColor="none"
      thickness={8}
      strokeCap="round"
      showsText={true}
      unfilledColor="#555555"
    />
  );
}
