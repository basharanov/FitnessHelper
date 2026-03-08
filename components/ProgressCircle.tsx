import { Circle } from "react-native-progress";

type Props = {
  progressValue: number;
};

export default function ProgressCircle({ progressValue }: Props) {
  return (
    <Circle
      progress={progressValue}
      size={400}
      color="lightgreen"
      borderColor="none"
      thickness={8}
      strokeCap="round"
      showsText={true}
      unfilledColor="#555555"
    />
  );
}
