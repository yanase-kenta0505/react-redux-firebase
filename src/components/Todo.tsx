import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { useOnClickOutside } from "usehooks-ts";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  deleteTodos,
  changeTitle,
  changeDate,
  changeDetail,
  changeStatus,
} from "../features/todo/todosSlice";
import {
  Button,
  Input,
  Tr,
  Td,
  Text,
  Textarea,
  Select,
  Flex,
  Box,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface PROPS {
  index: number;
  id: string;
  uid: string;
  title: string;
  date: any;
  detail: string;
  status: string;
}

const Task: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const toast = useToast();
  const ref = useRef(null);
  const statusList = [
    { value: "no-yet", label: "未着手", color: "#E53E3E" },
    { value: "start", label: "着手", color: "#DD6B20" },
    { value: "comp", label: "完了", color: "#38A169" },
  ];
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isEditDate, setIsEditDate] = useState(false);
  const [isEditDetail, setIsEditDetail] = useState(false);
  const [todoTitle, setTodoTitle] = useState(props.title);
  const [todoDate, setTodoDate] = useState(props.date);
  const [todoDetail, setTodoDetail] = useState(props.detail);

  //Selectのvalueに合わせて、statusListのcolorを返す
  const getStatusColor = () => {
    const status = statusList.find((status) => status.value === props.status);
    return status?.color;
  };

  //タスク名と完了予定日のinput以外をクリックしたかどうかの判定を行う
  const handleClickOutside = () => {
    if (isEditTitle) {
      if (user.uid) {
        updateDoc(doc(db, "todos", props.id), {
          title: todoTitle,
        });
      } else {
        dispatch(changeTitle({ index: props.index, title: todoTitle }));
      }
      setIsEditTitle(false);
    }
    if (isEditDate) {
      if (user.uid) {
        updateDoc(doc(db, "todos", props.id), {
          date: todoDate,
        });
      } else {
        dispatch(changeDate({ index: props.index, date: todoDate }));
      }
      setIsEditDate(false);
    }
    if (isEditDetail) {
      if (user.uid) {
        updateDoc(doc(db, "todos", props.id), {
          detail: todoDetail,
        });
      } else {
        dispatch(changeDetail({ index: props.index, detail: todoDetail }));
      }
      setIsEditDetail(false);
    }
    savedTodoToast();
  };
  const savedTodoToast = () => {
    toast({
      title: "タスクを更新しました.",
      description: "",
      status: "success",
      duration: 9000,
      isClosable: true,
      position: "bottom-right",
    });
  };
  useOnClickOutside(ref, handleClickOutside);
  return (
    <Tr>
      <Td maxW={"25rem"}>
        {isEditTitle ? (
          <Input
            ref={ref}
            placeholder="タスク名を入力してください"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
          />
        ) : (
          <Flex
            cursor={"pointer"}
            transition={"all ease 0.3s"}
            _hover={{ borderBottom: "1px solid #ccc" }}
            pb={2}
            onClick={() => setIsEditTitle(!isEditTitle)}
          >
            <EditIcon mr={2} />
            {props.title}
          </Flex>
        )}
      </Td>
      <Td>
        {isEditDate ? (
          <Input
            ref={ref}
            placeholder="Select Date and Time"
            size="md"
            type="date"
            value={todoDate}
            onChange={(e) => setTodoDate(e.target.value)}
          />
        ) : (
          <Box
            pb={2}
            cursor={"pointer"}
            transition={"all ease 0.3s"}
            _hover={{ borderBottom: "1px solid #ccc" }}
            onClick={() => setIsEditDate(!isEditDate)}
          >
            {props.date}
          </Box>
        )}
      </Td>
      <Td>
        {isEditDetail ? (
          <Textarea
            ref={ref}
            placeholder="詳細を入力してください"
            value={todoDetail}
            onChange={(e) => setTodoDetail(e.target.value)}
          />
        ) : (
          <Text
            pb={2}
            cursor={"pointer"}
            transition={"all ease 0.3s"}
            _hover={{ borderBottom: "1px solid #ccc" }}
            onClick={() => setIsEditDetail(!isEditDetail)}
          >
            {props.detail ? props.detail : "詳細を入力してください"}
          </Text>
        )}
      </Td>
      <Td>
        <Select
          value={props.status}
          bg={getStatusColor()}
          color="white"
          onChange={(e) => {
            if (user.uid) {
              updateDoc(doc(db, "todos", props.id), {
                status: e.target.value,
              });
            } else {
              dispatch(
                changeStatus({ index: props.index, status: e.target.value })
              );
            }
            savedTodoToast();
          }}
        >
          {statusList.map((status) => {
            return (
              <option
                value={status.value}
                key={status.value}
                style={{ color: "black" }}
              >
                {status.label}
              </option>
            );
          })}
        </Select>
      </Td>
      <Td>
        <Button
          leftIcon={<DeleteIcon />}
          colorScheme={"red"}
          px={10}
          onClick={() => {
            if (user.uid) {
              deleteDoc(doc(db, "todos", props.id));
            } else {
              dispatch(deleteTodos({ index: props.index }));
            }
            toast({
              title: "タスクを削除しました",
              status: "error",
              isClosable: true,
              position: "bottom-right",
            });
          }}
        >
          削除
        </Button>
      </Td>
    </Tr>
  );
};

export default Task;
