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

function progressValidation(value: any) {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 0;
  }
  return Math.max(0, Math.min(1, num));
}

export default function ProgressCircle({ progressValue, size }: Props) {
  const progress = progressValidation(progressValue);
  return (
    <Circle
      progress={progress}
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
