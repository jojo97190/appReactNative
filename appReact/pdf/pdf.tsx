import RNFS from "react-native-fs";
import { DocumentPDFConfiguration } from "@nutrient-sdk/react-native";
const Processor = NativeModules.RNProcessor;

const configuration: DocumentPDFConfiguration = {
  filePath: `file:///${RNFS.TemporaryDirectoryPath}/newDocument.pdf`,
  documents: [
    {
      documentPath: "path/to/document1.pdf",
      pageIndex: 5,
    },
    {
      documentPath: "path/to/document2.pdf",
      pageIndex: 8,
    },
  ],
  override: true,
};

const { fileURL } = await Processor.generatePDFFromDocuments(configuration);