import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export type BookType = {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        publishedDate: string;
        imageLinks?: {
            thumbnail: string;
            smallThumbnail: string;
        };
    };
};

type ApiResponseType = { items: BookType[] };

// styled. 으로 연결할 때에는 기본 태그일 때
const Wrap = styled.div`
    padding: 30px;
`;

// styled()로 연결할 때에는 컴포넌트일 때
// 이 StyleLink라는 얘는, Link의 기능을 물려받은 스타일링 적용한 컴포넌트가 됨

const StyleLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: white;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    transition: all 0.5s;

    {/* 
    이건 styled-components의 문법이 아니라,
    sass (향상된 CSS) 문법임
    */}
    &:hover {
        background-color: #f3f3f3;
    }
`;

const Cover = styled.img`
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 4px;
`;

const NoCover = styled.div`
    width: 60px;
    height: 90px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.div`
    font-weight: 600;
    margin-bottom: 4px;
`;

const Authors = styled.div`
    font-size: 12px;
    color: #555;
`;

function Search() {
    // 사용자가 요청한 keyword를 받아서 그것을 가지고 google API 요청을 하고, 받아온 결과를 화면에 출력해주는 일

    // keyword를 쿼리스트링으로 받겠다
    const [searchParams] = useSearchParams();
    // 이렇게 가져온 sear             chParams라고 하는 state의 값은 객체
    const keyword = searchParams.get("keyword");

    const [list, setList] = useState<BookType[]>([]);

    useEffect(() => {
        if (!keyword) {
            return;
        }

        fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=20&key=${API_KEY}`,
        )
            .then(response => response.json())
            .then((json: ApiResponseType) => {
                // 데이터를 받아왔고, 그거에 대해서 자바스크립트 형태로 가공도 했으니
                // 그걸 list라고 하는 state에 저장해야지
                setList(json.items);
            })
            .catch(err => {
                console.log(err);
            });
    }, [keyword]);

    return (
        <Wrap>
            <h3>검색 결과 : {keyword}</h3>

            {/* 검색 결과 (책 목록) 출력 */}
            {/* 데이터가 도착했는지 안했는지, 목록이 있는지 없는지 판단 해줘야 하나? */}
            {list.length === 0 && <div>검색 결과가 없습니다.</div>}
            {/* map이라고 하는 메소드는 꼭 대상이 array여야만 쓸 수 있으니, list && 로 체크해줄 땐,
        list가 null이 되나? 를 생각해봐야겠지만, 여기서 모든 조건을 따져 봤을 때 list는 무조건
        array이긴 하니까 굳이 논리곱으로 체크해줄 필요가 없다. */}
            {list.map((value, index) => (
                <StyleLink key={index} to={`/detail/${value.id}`}>
                    {value.volumeInfo.imageLinks ? (
                        <Cover
                            src={value.volumeInfo.imageLinks?.thumbnail}
                            alt={value.volumeInfo.title}
                        />
                    ) : (
                        <NoCover>No Cover</NoCover>
                    )}
                    <div>
                        <Title>{value.volumeInfo.title}</Title>
                        {/*
                            array에서 사용할 수 잇는 메소드 join()
                            각 요소를 순회해서 하나의 값을 리턴하는데
                            각 요소 사이에 [매개변수로 제공된 스트링]을 넣어준다.
                        */}
                        <Authors>{value.volumeInfo.authors?.join()}</Authors>
                    </div>
                </StyleLink>
            ))}
        </Wrap>
    );
}

export default Search;
