import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
import pygame
import random

# Initialize pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH, SCREEN_HEIGHT = 300, 600
BLOCK_SIZE = 30

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY = (128, 128, 128)

# Tetromino shapes and colors
SHAPES = [
    [[1, 1, 1, 1]],  # I
    [[1, 1], [1, 1]],  # O
    [[0, 1, 0], [1, 1, 1]],  # T
    [[1, 0, 0], [1, 1, 1]],  # J
    [[0, 0, 1], [1, 1, 1]],  # L
    [[1, 1, 0], [0, 1, 1]],  # S
    [[0, 1, 1], [1, 1, 0]]   # Z
]

COLORS = [
    (0, 255, 255),  # Cyan
    (255, 255, 0),  # Yellow
    (128, 0, 128),  # Purple
    (0, 0, 255),    # Blue
    (255, 165, 0),  # Orange
    (0, 255, 0),    # Green
    (255, 0, 0)     # Red
]

class Tetromino:
    def __init__(self, x, y, shape):
        self.x = x
        self.y = y
        self.shape = shape
        self.color = COLORS[SHAPES.index(shape)]
        self.rotation = 0

    def image(self):
        return self.shape[self.rotation % len(self.shape)] if isinstance(self.shape, list) else self.shape

    def rotate(self):
        self.rotation = (self.rotation + 1) % len(self.shape)

class Tetris:
    def __init__(self, height, width):
        self.height = height
        self.width = width
        self.field = [[0 for _ in range(width)] for _ in range(height)]
        self.score = 0
        self.game_over = False
        self.current_piece = self.new_piece()

    def new_piece(self):
        shape = random.choice(SHAPES)
        return Tetromino(self.width // 2 - len(shape[0]) // 2, 0, shape)

    def intersects(self):
        piece = self.current_piece
        shape = piece.shape
        for i, row in enumerate(shape):
            for j, val in enumerate(row):
                if val:
                    x = piece.x + j
                    y = piece.y + i
                    if x < 0 or x >= self.width or y >= self.height or self.field[y][x]:
                        return True
        return False

    def freeze(self):
        piece = self.current_piece
        shape = piece.shape
        for i, row in enumerate(shape):
            for j, val in enumerate(row):
                if val:
                    self.field[piece.y + i][piece.x + j] = piece.color
        self.break_lines()
        self.current_piece = self.new_piece()
        if self.intersects():
            self.game_over = True

    def break_lines(self):
        lines = 0
        for i in range(self.height - 1, -1, -1):
            if 0 not in self.field[i]:
                del self.field[i]
                self.field.insert(0, [0 for _ in range(self.width)])
                lines += 1
        self.score += lines ** 2 * 100

    def go_down(self):
        self.current_piece.y += 1
        if self.intersects():
            self.current_piece.y -= 1
            self.freeze()

    def go_side(self, dx):
        self.current_piece.x += dx
        if self.intersects():
            self.current_piece.x -= dx

    def rotate(self):
        old_rotation = self.current_piece.rotation
        self.current_piece.rotate()
        if self.intersects():
            self.current_piece.rotation = old_rotation

def draw_grid(surface, grid):
    for y in range(len(grid)):
        for x in range(len(grid[y])):
            rect = pygame.Rect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
            pygame.draw.rect(surface, GRAY, rect, 1)
            if grid[y][x]:
                pygame.draw.rect(surface, grid[y][x], rect)

def draw_piece(surface, piece):
    shape = piece.shape
    for i, row in enumerate(shape):
        for j, val in enumerate(row):
            if val:
                rect = pygame.Rect((piece.x + j) * BLOCK_SIZE, (piece.y + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
                pygame.draw.rect(surface, piece.color, rect)

def draw_text(surface, text, size, x, y, color=WHITE):
    font = pygame.font.SysFont('Arial', size, bold=True)
    label = font.render(text, True, color)
    surface.blit(label, (x, y))

def main():
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption('Tetris by sovqz')
    clock = pygame.time.Clock()
    game = Tetris(SCREEN_HEIGHT // BLOCK_SIZE, SCREEN_WIDTH // BLOCK_SIZE)

    fall_time = 0
    fall_speed = 500  # milliseconds

    running = True
    while running:
        screen.fill(BLACK)
        fall_time += clock.get_rawtime()
        clock.tick()

        if fall_time > fall_speed:
            fall_time = 0
            if not game.game_over:
                game.go_down()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    game.go_side(-1)
                elif event.key == pygame.K_RIGHT:
                    game.go_side(1)
                elif event.key == pygame.K_DOWN:
                    game.go_down()
                elif event.key == pygame.K_UP:
                    game.rotate()

        draw_grid(screen, game.field)
        draw_piece(screen, game.current_piece)
        draw_text(screen, f'Score: {game.score}', 24, 10, 10)
        draw_text(screen, 'Created by sovqz', 18, 10, SCREEN_HEIGHT - 30)

        if game.game_over:
            draw_text(screen, 'GAME OVER', 48, SCREEN_WIDTH // 4, SCREEN_HEIGHT // 2 - 24, color=(255, 0, 0))

        pygame.display.update()

    pygame.quit()

if __name__ == "__main__":
    main()

