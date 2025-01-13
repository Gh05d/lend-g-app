import React, {useEffect, useState} from "react";
import LoadingModal from "../LoadingModal";

type Props = {loading: boolean; sentences: string[]};

const DynamicTextLoadingModal: React.FC<Props> = ({loading, sentences}) => {
  const [index, setIndex] = useState(0);
  console.log(index);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(Math.floor(Math.random() * sentences.length));
    }, 2300);

    return () => {
      clearInterval(interval);
    };
  }, [sentences.length]);

  return <LoadingModal text={sentences[index]} loading={loading} />;
};

export default DynamicTextLoadingModal;
