import { Injectable, signal, computed } from '@angular/core';

/**
 * Supported language codes for the application.
 */
type SupportedLang = 'en' | 'pl';

/**
 * Interface defining all translation keys.
 * Provides type safety and autocomplete for translations.
 */
interface TranslationDictionary {
  readonly MENU_TITLE: string;
  readonly SAVE_BTN: string;
  readonly LOAD_BTN: string;
  readonly EXPORT_BTN: string;
  readonly HINT: string;
  readonly BTN_VERTICAL: string;
  readonly BTN_HORIZONTAL: string;
  readonly MODE_VIEW: string;
  readonly MODE_EDIT: string;
  readonly START_BTN: string;
  readonly ADD_STEP_BTN: string;
  readonly ADD_OPTION_BTN: string;
  readonly TIP_CHANGE_TYPE: string;
  readonly TIP_DELETE: string;
  readonly TIP_SIDEBAR: string;
  readonly HELP_TITLE: string;
  readonly HELP_BASICS: string;
  readonly HELP_WORKFLOW: string;
  readonly HELP_FAQ: string;
  readonly MODAL_CLOSE: string;
  readonly TUTORIAL_BASICS_TITLE: string;
  readonly TUTORIAL_BASICS_CONTENT: readonly string[];
  readonly TUTORIAL_WORKFLOW_TITLE: string;
  readonly TUTORIAL_WORKFLOW_CONTENT: readonly string[];
  readonly TUTORIAL_FAQ_TITLE: string;
  readonly TUTORIAL_FAQ_CONTENT: readonly { readonly q: string; readonly a: string }[];

  // Keys for workflow operations
  readonly NEW_STEP_DEFAULT_TEXT: string;
  readonly NEW_RECT_DEFAULT_TEXT: string;
  readonly EXPORT_ERROR: string;
  readonly FILE_READ_ERROR: string;
  readonly FILE_PARSE_ERROR: string;
}

/**
 * Service responsible for handling application translations.
 * Uses Angular Signals for reactive language switching.
 *
 * @example
 * ```typescript
 * // In component
 * lang = inject(TranslationService);
 *
 * // In template
 * {{ lang.t().MENU_TITLE }}
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  /** Current language signal */
  currentLang = signal<SupportedLang>('en');

  /** Type-safe translation dictionaries */
  private readonly dictionaries: Record<SupportedLang, TranslationDictionary> = {
    en: {
      MENU_TITLE: "Operations",
      SAVE_BTN: "Save Diagram",
      LOAD_BTN: "Load Diagram",
      EXPORT_BTN: "Export SVG",
      HINT: "Hint: Edit the diagram by clicking directly on the elements.",
      

      BTN_VERTICAL: "│ Vertical",
      BTN_HORIZONTAL: "━ Horizontal",
      MODE_VIEW: "👁️ View",
      MODE_EDIT: "✏️ Edit",
      

      START_BTN: "+ START (ADD STEP)",
      ADD_STEP_BTN: "+ Add",
      ADD_OPTION_BTN: "+ Add Option",
      

      TIP_CHANGE_TYPE: "Change Type / Reset",
      TIP_DELETE: "Delete Step",
      TIP_SIDEBAR: "Show/Hide Menu",

     
      HELP_TITLE: "Help & Tutorials",
      HELP_BASICS: "Getting Started",
      HELP_WORKFLOW: "Create Workflows",
      HELP_FAQ: "FAQ",
      MODAL_CLOSE: "Close",

 
      TUTORIAL_BASICS_TITLE: "Getting Started",
      TUTORIAL_BASICS_CONTENT: [
        "This tool was originally created to help me organize my work in a clear way. Try to create short and concise descriptions of main steps. If a main node (step) needs to be broken down, e.g. it's quite complex, create additional steps (rectangles) by clicking 🔄 to maintain clarity and accessibility of the diagram, and thus the quality of your work. However, I would recommend that the main step performs one thing that consists of smaller steps - rectangles. By opening the sidebar by clicking the ▶ button, you can save the diagram, load it, or save it as an SVG image."
      ],
      TUTORIAL_WORKFLOW_TITLE: "Creating Workflow",
      TUTORIAL_WORKFLOW_CONTENT: [
        "Click on the diagram area",
        "Add new elements by clicking the 'Add' button",
        "Edit text by clicking on the element",
        "Change the diagram orientation freely using the buttons in the top right corner",
        "After finishing your work, switch to preview mode to see how the final diagram will look",
        "Save your work or export the diagram as an SVG image using the buttons in the sidebar"
      ],
      TUTORIAL_FAQ_TITLE: "Frequently Asked Questions",
      TUTORIAL_FAQ_CONTENT: [
        { q: "How to save the diagram?", a: "Click \"Save to file\" in the sidebar." },
        { q: "How to export to image?", a: "Use the \"Export SVG\" button." },
        { q: "How to load an existing diagram?", a: "Click \"Load from file\" and select a JSON file." }
      ],
     
      NEW_STEP_DEFAULT_TEXT: "New Step",
      NEW_RECT_DEFAULT_TEXT: "Step",
      EXPORT_ERROR: "Diagram container not found!",
      FILE_READ_ERROR: "Error reading file. Please check if the file is not corrupted.",
      FILE_PARSE_ERROR: "Error parsing JSON file."
    },
    pl: {
    
      MENU_TITLE: "Operacje",
      SAVE_BTN: "Zapisz Diagram",
      LOAD_BTN: "Wczytaj Diagram",
      EXPORT_BTN: "Eksportuj SVG",
      HINT: "Wskazówka: Edytuj diagram klikając bezpośrednio na elementy.",
      
    
      BTN_VERTICAL: "│ Pionowo",
      BTN_HORIZONTAL: "━ Poziomo",
      MODE_VIEW: "👁️ Podgląd",
      MODE_EDIT: "✏️ Edycja",
      
      
      START_BTN: "+ ROZPOCZNIJ (DODAJ KROK)",
      ADD_STEP_BTN: "+ Dodaj",
      ADD_OPTION_BTN: "+ Dodaj opcję",
      
     
      TIP_CHANGE_TYPE: "Zmień typ / Reset",
      TIP_DELETE: "Usuń krok",
      TIP_SIDEBAR: "Pokaż/Ukryj menu",

      
      HELP_TITLE: "Pomoc i samouczek",
      HELP_BASICS: "Pierwsze kroki",
      HELP_WORKFLOW: "Tworzenie workflow",
      HELP_FAQ: "Często zadawane pytania",
      MODAL_CLOSE: "Zamknij",

    
      TUTORIAL_BASICS_TITLE: "Pierwsze kroki",
      TUTORIAL_BASICS_CONTENT: [
        "Narzędzie zostało oryginalnie stworzone do ułatwienia mi organizacji pracy w przejrzysty sposób. Staraj się tworzyć krótkie i zwięzłe opisy kroków głównych. Jeśli główny węzeł (krok) wymaga rozbicia, np. jest dość złożony, utwórz dodatkowe kroki (prostokąty) klikając 🔄, aby zachować przejrzystość i przystępność diagramu, a tym samym jakość swojej pracy. Chociaż polecałbym, aby krok główny wykonywał jedną rzecz, na którą składają się mniejsze kroki - prostokąty. Otwierając sidebar klikając przycisk ▶, możesz zapisać diagram, wczytać go lub zapisać jako obraz SVG."
      ],
      TUTORIAL_WORKFLOW_TITLE: "Tworzenie Workflow",
      TUTORIAL_WORKFLOW_CONTENT: [
        "Kliknij na obszar diagramu",
        "Dodaj nowe elementy klikając na przycisk 'Dodaj'",
        "Edytuj tekst klikając na element",
        "Zmieniaj dowolnie orientację diagramu używając przycisków w prawym górnym rogu",
        "Po zakończeniu pracy, przejdź w tryb podglądu aby zobaczyć jak będzie wyglądał finalny diagram",
        "Zapisz swoją pracę, bądź eksportuj diagram jako obraz SVG używając przycisków w sidebar"
      ],
      TUTORIAL_FAQ_TITLE: "Często zadawane pytania",
      TUTORIAL_FAQ_CONTENT: [
        { q: "Jak zapisać diagram?", a: "Kliknij \"Zapisz do pliku\" w sidebar." },
        { q: "Jak wyeksportować do obrazu?", a: "Użyj przycisku \"Eksportuj SVG\"." },
        { q: "Jak wczytać istniejący diagram?", a: "Kliknij \"Wczytaj z pliku\" i wybierz plik JSON." }
      ],
   
      NEW_STEP_DEFAULT_TEXT: "Nowy krok",
      NEW_RECT_DEFAULT_TEXT: "Krok",
      EXPORT_ERROR: "Nie znaleziono kontenera diagramu!",
      FILE_READ_ERROR: "Błąd podczas odczytu pliku. Sprawdź czy plik nie jest uszkodzony.",
      FILE_PARSE_ERROR: "Błąd parsowania pliku JSON."
    }
  } as const;

  /**
   * Computed signal that returns the current language dictionary.
   * Automatically updates when currentLang changes.
   */
  t = computed<TranslationDictionary>(() => this.dictionaries[this.currentLang()]);

  /**
   * Toggles between English and Polish languages.
   */
  toggleLang(): void {
    this.currentLang.update(lang => lang === 'en' ? 'pl' : 'en');
  }
}