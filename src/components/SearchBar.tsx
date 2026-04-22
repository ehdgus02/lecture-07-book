import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

const Box = styled.form`
    display: flex;
    gap: 10px;
    width: 100%;
`;

const Input = styled.input`
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
`;

const Button = styled.button`
    padding: 12px 18px;
    border: none;
    background-color: black;
    color: white;
    border-radius: 8px;
    cursor: pointer;
`;


function SearchBar() {
    const navigate = useNavigate(); // navigate 라고 하는 변수에 이동에 관련된 기능을 담아둬야 함
    const [keyword, setKeyword] = useState(""); // input에 입력되는 값을 관리할 목적의 state

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        // form에 onSubmit이라고 하는 기능은, 브라우저 측에 기본 기능이 "새로고침 하고 전달"이 있음
        // 이걸 하지 못하도록 해야 함.
        event.preventDefault();
        const k = keyword.trim();
        if (!k) return;


        // 사용자가 그냥 엔터 쳐버리는 경우
        // if (keyword === "") return;

        // 생각보다, 이 input에 스페이스바를 넣는 애들도 엄청 많음 "수학" => " 수학"
        // string의 맨 앞과 맨 뒤에 존재할 수 있는 공백을 제거하는 메서드 :
        // "" 에서 사용자가 enter -> keyword.trim() -> ""    -> if (keyword.trim()) -> false
        // " "에서 사용자가 enter -> keyword.trim() -> ""

        // if (!keyword.trim()) return; // trim을 했더니, 값이 빈 스트링이면 return으로 끝내라

        // keyword를 활요앻서 사용자를 강제 이동
        // search 라고 하는 경로에, query string으로 keyword를 전달해서 사용자 이동
        // URL은 한굴이 X, 영어랑 몇가지의 특수문자만 가능
        // 해석을 할 수 있도록 영어랑 몇 가지의 특수문자를 이용해 변환 작업이 필요함 -> encodeURIComponent()
        navigate(`/search?keyword=${encodeURIComponent(k)}`);
    };

    const onChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        // 사용자가 입력한 값을 받아다가, keyword라고 하는 state에 저장
        // 사용자가 입력한 값은 => event.target.value
        setKeyword(event.target.value);
    };

    return (
        <Box onSubmit={onSubmit}>
            <Input onChange={onChange} />
            <Button type={"submit"}>
                검색
            </Button>
        </Box>
    );
}

export default SearchBar;
