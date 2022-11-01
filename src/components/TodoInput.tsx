import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TodosMaxIndex } from "../features/todo/todosSlice";
import { selectUser } from "../features/user/userSlice";
import { updateTodos } from "../features/todo/todosSlice";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Input, Select, Button, Flex, FormControl } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const TaskInput: React.FC = () => {
  const user = useSelector(selectUser);
  const TodosmaxIndex = useSelector(TodosMaxIndex);
  const dispatch = useDispatch();
  const [todoTitle, setTodoTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [todoStatus, setTodoStatus] = useState("no-yet");

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.uid) {
      addDoc(collection(db, "todos"), {
        id: "",
        uid: user.uid,
        title: todoTitle,
        date: startDate,
        detail: "",
        status: todoStatus,
      });
    } else {
      dispatch(
        updateTodos({
          id: TodosmaxIndex,
          uid: user.uid ? user.uid : "",
          title: todoTitle,
          date: startDate,
          detail: "",
          status: todoStatus,
        })
      );
    }
    setTodoTitle("");
    setStartDate(getToday());
    setTodoStatus("no-yet");
  };
  const statusList = [
    { value: "no-yet", label: "未着手", color: "red" },
    { value: "start", label: "着手", color: "orange" },
    { value: "comp", label: "完了", color: "green" },
  ];

  const getToday = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = ("0" + (today.getMonth() + 1)).slice(-2);
    const dd = ("0" + today.getDate()).slice(-2);
    return yyyy + "-" + mm + "-" + dd;
  };
  useEffect(() => {
    setStartDate(getToday());
  }, []);
  return (
    <form onSubmit={addTodo}>
      <Flex>
        <FormControl isRequired mr={5}>
          <Input
            placeholder="タスク名を入力してください"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired w={"auto"} mr={5}>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>
        <Select
          mr={5}
          w={"auto"}
          flexShrink={0}
          value={todoStatus}
          onChange={(e) => setTodoStatus(e.target.value)}
        >
          {statusList.map((status) => {
            return (
              <option value={status.value} key={status.value}>
                {status.label}
              </option>
            );
          })}
        </Select>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          flexShrink={"0"}
          type="submit"
          px={10}
        >
          追加
        </Button>
      </Flex>
    </form>
  );
};

export default TaskInput;
