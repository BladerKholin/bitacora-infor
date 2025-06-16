
import {Field } from "@chakra-ui/react";
import FileRenderer from "./renderer";

const FileViewer = ({ fileId, fileName }) => {
    return (
        <div>
            <Field.Root>
                <Field.Label>Vista previa</Field.Label>
                <FileRenderer fileId={fileId} />
                <Field.HelperText>{'Los archivos word, excel o powerpoint pueden tomar mas tiempo en cargar y quizá no se visualicen de forma precisa '}</Field.HelperText>
            </Field.Root>
        </div>
)
};

export default FileViewer;
