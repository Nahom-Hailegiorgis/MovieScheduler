import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import react, { use, useState } from "react";

const { width, height } = Dimensions.get("window");

export default function App() {
  const basePoints = {
    2: 5,
    3: 4,
    4: 5,
    5: 3,
    6: 3,
    7: 1,
    8: 2,
    9: 1,
  };

  const [first, changeFirst] = useState("");
  const [second, changeSecond] = useState("");
  const [third, changeThird] = useState("");

  const [finalFirst, setfinalFirst] = useState("1st: ");
  const [finalSecond, setFinalSecond] = useState("2nd: ");
  const [finalThird, setFinalThird] = useState("3rd: ");
  const [finalFourth, setFinalFourth] = useState("4th: ");
  const [finalFifth, setFinalFifth] = useState("5th: ");

  const [firstBorderColor, setfirstBorderColor] = useState(
    "rgba(173, 122, 153, .1)"
  );
  const [secondBorderColor, setsecondBorderColor] = useState(
    "rgba(173, 122, 153, .1)"
  );
  const [thirdBorderColor, setthirdBorderColor] = useState(
    "rgba(173, 122, 153, .1)"
  );

  const setFirst = (time) => {
    changeFirst(time);
  };
  const setSecond = (time) => {
    changeSecond(time);
  };
  const setThird = (time) => {
    changeThird(time);
  };

  const validNumbers = ["2", "4", "6", "8", "3", "5", "7", "9"];
  const regex = /^([2-9])\s(pm)$/;

  const validatefirstTime = (time) => {
    if (!regex.test(time)) {
      setfirstBorderColor("#9C0D38");
      return false;
    }
    if (time === second || time === third) {
      setfirstBorderColor("#9C0D38");
      Alert.alert("Duplicate Time", "Each time must be unique.");
      return false;
    }
    setfirstBorderColor("rgba(173, 122, 153, .1)");
    changeFirst(time);
    return true;
  };

  const validatesecondTime = (time) => {
    if (!regex.test(time)) {
      setsecondBorderColor("#9C0D38");
      return false;
    }
    if (time === first || time === third) {
      setsecondBorderColor("#9C0D38");
      Alert.alert("Duplicate Time", "Each time must be unique.");
      return false;
    }
    setsecondBorderColor("rgba(173, 122, 153, .1)");
    changeSecond(time);
    return true;
  };

  const validatethirdTime = (time) => {
    if (!regex.test(time)) {
      setthirdBorderColor("#9C0D38");
      return false;
    }
    if (time === first || time === second) {
      setthirdBorderColor("#9C0D38");
      Alert.alert("Duplicate Time", "Each time must be unique.");
      return false;
    }
    setthirdBorderColor("rgba(173, 122, 153, .1)");
    changeThird(time);
    return true;
  };

  const handleSubmit = () => {
    const isfirstValid = validatefirstTime(first);
    const issecondValid = validatesecondTime(second);
    const isthirdValid = validatethirdTime(third);

    if (isfirstValid && issecondValid && isthirdValid) {
      const selectedTimes = [
        { time: first, points: basePoints[first] + 3 }, // 3 points for first selection
        { time: second, points: basePoints[second] + 2 }, // 2 points for second selection
        { time: third, points: basePoints[third] + 1 }, // 1 point for third selection
      ];

      // Get all times with their base points
      const allTimes = Object.keys(basePoints).map((time) => ({
        time: parseInt(time), // Convert the time key to integer
        points: basePoints[time],
      }));

      // Merge selectedTimes into allTimes (Update the points based on the selections)
      selectedTimes.forEach((selected) => {
        const index = allTimes.findIndex((item) => item.time === selected.time);
        if (index !== -1) {
          allTimes[index].points += selected.points - basePoints[selected.time];
        }
      });

      // Sort times by points in descending order
      const sortedTimesByPoints = allTimes.sort((a, b) => b.points - a.points);

      // Get the top 5 based on points
      const top5Times = sortedTimesByPoints.slice(0, 5);

      // Sort the top 5 by their original 'time' value (earliest to latest)
      top5Times.sort((a, b) => a.time - b.time); // Sort chronologically

      // Set the top 5 in the final results
      setfinalFirst(`${top5Times[0]?.time || "N/A"} pm`);
      setFinalSecond(`${top5Times[1]?.time || "N/A"} pm`);
      setFinalThird(`${top5Times[2]?.time || "N/A"} pm`);
      setFinalFourth(`${top5Times[3]?.time || "N/A"} pm`);
      setFinalFifth(`${top5Times[4]?.time || "N/A"} pm`);

      // Display results in alert
      Alert.alert(
        "Top 5 Times",
        `1st: ${top5Times[0]?.time}, 2nd: ${top5Times[1]?.time}, 3rd: ${top5Times[2]?.time}`
      );
    } else {
      Alert.alert("Invalid Time", "Please enter a valid time like '3pm'.");
    }
  };

  function convertTimeToDate(time) {
    // Assuming the time is in format "h:mm am/pm" (e.g., "3:00 pm", "12:30 am")
    const [hourMinute, period] = time.split(" "); // Split time and period (AM/PM)
    let [hour, minute] = hourMinute.split(":").map(Number); // Split hour and minute

    // Convert 12-hour time format to 24-hour time format
    if (period.toLowerCase() === "pm" && hour < 12) {
      hour += 12; // Convert PM hours
    } else if (period.toLowerCase() === "am" && hour === 12) {
      hour = 0; // Convert 12 AM to 00
    }

    // Create a Date object with the time values
    const timeString = `1970-01-01T${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:00Z`;
    return new Date(timeString).getTime(); // Return timestamp (milliseconds since epoch)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.header}>Movie Scheduler</Text>
      </View>
      <View style={styles.break}></View>
      <Text style={styles.section_text}>Available Times:</Text>
      <View style={styles.rowed_options}>
        <Text style={styles.time_option}>2pm</Text>
        <Text style={styles.time_option}>4pm</Text>
        <Text style={styles.time_option}>6pm</Text>
        <Text style={styles.time_option}>8pm</Text>
      </View>
      <View style={styles.rowed_options}>
        <Text style={styles.time_option}>3pm</Text>
        <Text style={styles.time_option}>5pm</Text>
        <Text style={styles.time_option}>7pm</Text>
        <Text style={styles.time_option}>9pm</Text>
      </View>
      <View style={styles.break}></View>
      <Text style={[styles.section_text, { marginTop: height * 0.01 }]}>
        Choices:
      </Text>
      <View style={styles.rowed_options}>
        <Text style={[styles.time_option, { fontSize: 22.5 }]}>1st:</Text>
        <TextInput
          style={[
            styles.input,
            { fontSize: 20.5, borderColor: firstBorderColor },
          ]}
          value={first}
          maxLength={5}
          placeholder="  pm"
          placeholderTextColor={"#CC7178"}
          onBlur={(e) => validatefirstTime(e.nativeEvent.text)}
          onChangeText={setFirst}
        />
        <Text style={[styles.time_option, { fontSize: 22.5 }]}>2nd:</Text>
        <TextInput
          style={[
            styles.input,
            { fontSize: 20.5, borderColor: secondBorderColor },
          ]}
          value={second}
          maxLength={5}
          placeholder="  pm"
          placeholderTextColor={"#CC7178"}
          onBlur={(e) => validatesecondTime(e.nativeEvent.text)}
          onChangeText={setSecond}
        />
        <Text style={[styles.time_option, { fontSize: 22.5 }]}>3rd:</Text>
        <TextInput
          style={[
            styles.input,
            {
              fontSize: 20.5,
              marginRight: width * 0.025,
              borderColor: thirdBorderColor,
            },
          ]}
          value={third}
          maxLength={5}
          placeholder="  pm"
          placeholderTextColor={"#CC7178"}
          onBlur={(e) => validatethirdTime(e.nativeEvent.text)}
          onChangeText={setThird}
        />
      </View>
      <TouchableOpacity style={styles.submit_button}>
        <Text style={styles.submit_text} onPress={handleSubmit}>
          Submit
        </Text>
      </TouchableOpacity>
      <View style={[styles.break, { marginVertical: height * 0.01 }]}></View>
      <View style={styles.list}>
        <View style={styles.listed_options}>
          <Text style={styles.listed_time}>
            Tommy | 1st: 2pm | 2nd: 5pm | 3rd: 3pm
          </Text>
        </View>
        <View style={styles.listed_options}>
          <Text style={styles.listed_time}>
            Jenny | 1st: 3pm | 2nd: 8pm | 3rd: 9pm
          </Text>
        </View>
        <View style={styles.listed_options}>
          <Text style={styles.listed_time}>
            Oliver | 1st: 6pm | 2nd: 4pm | 3rd: 7pm
          </Text>
        </View>
        <View style={styles.listed_options}>
          <Text style={styles.listed_time}>
            Beri | 1st: 4pm | 2nd: 2pm | 3rd: 5pm
          </Text>
        </View>
      </View>
      <View style={[styles.break, { marginVertical: height * 0.01 }]}></View>
      <Text
        style={[
          styles.section_text,
          { fontSize: 25.5, marginBottom: height * 0.0025 },
        ]}
      >
        5 Movie Times:
      </Text>
      <View style={styles.rowed_options}>
        <Text style={styles.finals}>{finalFirst}</Text>
        <Text style={styles.finals}>{finalSecond}</Text>
        <Text style={styles.finals}>{finalThird}</Text>
        <Text style={styles.finals}>{finalFourth}</Text>
        <Text style={styles.finals}>{finalFifth}</Text>
      </View>
      <View style={styles.footer_container}>
        <Text style={styles.footer}>
          &copy; 2025 Nahom Hailegiorgis. All Rights Reserved. | Personal
          Project
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3B7A5",
  },
  break: {
    marginVertical: height * 0.0175,
    paddingVertical: height * 0.00175,
    marginHorizontal: width * 0.135,
    borderRadius: height * 0.0175,
    opacity: 0.75,
    backgroundColor: "#fff",
  },
  header_container: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: height * 0.03,
    backgroundColor: "#EAA29A",
  },
  header: {
    fontFamily: "Georgia",
    fontSize: height * 0.05,
    fontStyle: "italic",
    color: "#C50D07",
    textAlign: "center",
    marginTop: height * 0.03,
  },
  section_text: {
    fontFamily: "Georgia",
    fontSize: height * 0.0355,
    color: "#E07367",
    textAlign: "center",
    marginBottom: height * 0.005,
  },
  rowed_options: {
    flexDirection: "row",
    alignSelf: "center",
  },
  time_option: {
    fontFamily: "Georgia",
    fontSize: height * 0.0375,
    color: "#C50D07",
    textAlign: "center",
    marginVertical: height * 0.0175,
    marginHorizontal: width * 0.035,
  },
  input: {
    borderRadius: height * 0.015,
    fontSize: height * 0.275,
    height: height * 0.04,
    marginTop: height * 0.015,
    paddingHorizontal: width * 0.015,
    color: "#CC7178",
    borderWidth: height * 0.005,
  },
  submit_button: {
    paddingHorizontal: width * 0.015,
    paddingVertical: height * 0.01,
    marginTop: height * 0.01,
    marginHorizontal: width * 0.3,
    backgroundColor: "#9C0D38",
    borderRadius: height * 0.0175,
  },
  submit_text: {
    textAlign: "center",
    fontFamily: "Georgia",
    fontSize: height * 0.0225,
    color: "#fff",
  },
  list: {
    marginHorizontal: width * 0.07,
    paddingVertical: height * 0.015,
    borderRadius: height * 0.0175,
    backgroundColor: "rgba(207, 77, 111, .1)",
    borderWidth: height * 0.005,
    borderColor: "rgba(207, 77, 111, .75)",
  },
  listed_options: {
    flexDirection: "row",
    alignSelf: "center",
  },
  listed_time: {
    fontFamily: "Georgia",
    fontSize: height * 0.021,
    color: "#C50D07",
    textAlign: "center",
    marginVertical: height * 0.0055,
    marginHorizontal: width * 0.005,
  },
  finals: {
    fontFamily: "Georgia",
    fontSize: height * 0.0225,
    color: "#C50D07",
    textAlign: "center",
    marginVertical: height * 0.0175,
    marginHorizontal: width * 0.0175,
  },
  footer_container: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: height * 0.01,
    backgroundColor: "#EAA28A",
  },
  footer: {
    fontFamily: "Georgia",
    fontSize: height * 0.0175,
    fontStyle: "italic",
    color: "#fff",
    textAlign: "center",
    marginBottom: height * 0.03,
    marginHorizontal: width * 0.025,
  },
});
