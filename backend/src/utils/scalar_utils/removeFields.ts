// /src/utils/swagger_utils/removeFields.ts

/**
 * Função recursiva para remover propriedades indesejadas de um objeto ou array.
 * @param obj - Objeto ou array onde os campos serão removidos.
 * @param fieldsToRemove - Lista de campos que devem ser removidos.
 */
export default function removeFieldsRecursively(
  obj: any,
  fieldsToRemove: string[]
): void {
  if (Array.isArray(obj)) {
    obj.forEach((item) => removeFieldsRecursively(item, fieldsToRemove));
  } else if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (fieldsToRemove.includes(key)) {
        delete obj[key];
      } else {
        removeFieldsRecursively(obj[key], fieldsToRemove);
      }
    });
  }
}
