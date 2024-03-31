import { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  Text,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import CommonButton from "../ui/CommonButton";

export default MemoInputModal = forwardRef((props, ref) => {
  const [enteredMemo, setEnteredMemo] = useState("");
  const [isModify, setIsModify] = useState(false);
  const [modifyMemoId, setModifyMemoId] = useState(null);
  const [warning, setWarning] = useState(false);
  const [selecteColor, setSelectedColor] = useState("#e6e6e6");

  useImperativeHandle(ref, () => ({
    modifyMemoHandler,
  }));

  function modifyMemoHandler(originMemo) {
    setEnteredMemo(originMemo.text);
    setModifyMemoId(originMemo.id);
    setSelectedColor(originMemo.color);
    setIsModify(true);
  }

  function memoInputHandler(enteredText) {
    if (enteredText.length > 0) {
      setWarning(false);
    }
    setEnteredMemo(enteredText);
  }

  function addMemoHandler() {
    if (enteredMemo.length === 0) {
      setWarning(true);
      return;
    }
    if (isModify) props.modifyMemo(enteredMemo, modifyMemoId, selecteColor);
    else props.addMemo(enteredMemo, selecteColor);
    modalCloseHandler();
  }

  function modalCloseHandler() {
    setEnteredMemo("");
    setWarning(false);
    setIsModify(false);
    setModifyMemoId(null);
    setSelectedColor("#e6e6e6");
    props.closeModal();
  }

  const colorOptions = [
    "#e6e6e6",
    "#fa5252",
    "#fae952",
    "#fab452",
    "#52c2fa",
    "#8452fa",
  ];

  return (
    <Modal
      visible={props.modalIsVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={modalCloseHandler}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
        <Pressable
          onPress={modalCloseHandler}
          style={styles.modalPressOverlay}
        ></Pressable>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="메모를 입력해주세요."
            onChangeText={memoInputHandler}
            value={enteredMemo}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
          />
          {warning && (
            <Text style={styles.warningText}>내용을 입력해주세요.</Text>
          )}
          <View style={styles.colorContainer}>
            {colorOptions.map((color, idx) => (
              <Pressable
                key={idx}
                style={{
                  ...styles.colorButton,
                  backgroundColor: color,
                  borderWidth: selecteColor === color ? 1.5 : 0,
                }}
                onPress={() => setSelectedColor(color)}
              ></Pressable>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <CommonButton onPress={modalCloseHandler} name="cancel">
              Cancel
            </CommonButton>
            <CommonButton onPress={addMemoHandler} name="add">
              {isModify ? "Edit" : "Add"}
            </CommonButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalPressOverlay: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    width: "100%",
    padding: 16,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowOpacity: 0.25,
    elevation: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#ececec",
    color: "#120438",
    borderRadius: 6,
    width: "100%",
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    width: 100,
    marginHorizontal: 10,
  },
  warningText: {
    alignSelf: "flex-start",
    color: "#ea4747",
    fontSize: 12,
    paddingLeft: 12,
    fontFamily: "NotoSansKR",
  },
  colorContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#000",
    marginHorizontal: 10,
    backgroundColor: "#ececec",
  },
});
