import styles from "./index.module.css";
import { useGame } from "../../hooks/useGame";
import { Position } from "../../domains/board/models";

export default function Main() {
  const {
    flags,
    hints,
    mines,
    revealed,
    timer,
    isGameover,
    isSuccess,
    isPlaying,
    difficulty,
    changeDifficulty,
    onClickCell,
    toggleFlag,
  } = useGame();

  const width = difficulty.value.size * 32;
  const size = difficulty.value.size;

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ width }}>
        <div className={styles.status}>
          {isGameover ? (
            <div className={styles.gameOver}>Game Over</div>
          ) : isSuccess ? (
            <div className={styles.win}>You Win!</div>
          ) : isPlaying ? (
            <div className={styles.playing}>Playing</div>
          ) : (
            <div className={styles.start}>Ready?</div>
          )}
        </div>
        <div className={styles.stats}>
          <div className={styles.state}>
            <div className={styles.value}>
              <select
                value={difficulty.key}
                onChange={(e) => {
                  if (isPlaying) {
                    return;
                  }
                  changeDifficulty(e.target.value);
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>💣</div>
            <div className={styles.value}>{difficulty.value.mineCount}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🚩</div>
            <div className={styles.value}>{flags.size}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🕰️</div>
            <div className={styles.value}>{timer.toString()}</div>
          </div>
        </div>
      </div>
      <div className={styles.cells} style={{ width }}>
        {new Array(size).fill("").map((_: string, row: number) => (
          <div key={row} className={styles.row}>
            {new Array(size).fill("").map((_: string, col: number) => {
              const position = new Position(row, col);
              const isRevealed = revealed.has(position);
              const isFlagged = flags.has(position);
              const isMine = mines.has(position);
              const hint = hints.get(row, col);
              return (
                <div
                  key={col}
                  className={`${styles.cell} ${isRevealed ? styles.revealed : ""}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (!isPlaying) {
                      return;
                    }
                    toggleFlag(row, col);
                  }}
                  onClick={() => {
                    onClickCell(position);
                  }}
                >
                  <CellContent
                    revealed={isRevealed}
                    mine={isMine}
                    flagged={isFlagged}
                    hint={hint}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CellContent({
  revealed,
  mine,
  flagged,
  hint,
}: {
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  hint: number;
}) {
  if (revealed) {
    return <RevealedContent mine={mine} hint={hint!} />;
  }

  return <HiddenContent flagged={flagged} />;
}

function RevealedContent({ mine, hint }: { mine: boolean; hint: number }) {
  if (mine) {
    return <>💣</>;
  }

  return <>{hint === 0 ? "" : hint}</>;
}

function HiddenContent({ flagged }: { flagged: boolean }) {
  return (
    <>
      {flagged ? (
        <span className={styles.flagged}>🚩</span>
      ) : (
        <span className={styles.hidden} />
      )}
    </>
  );
}
